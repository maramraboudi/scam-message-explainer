"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Bell, BookOpen, ChevronDown, CircleHelp, Crown, Download, FileSearch, FolderKanban, HelpCircle, Info, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, ShieldCheck, Sparkles, Sun, UserRound, X } from "lucide-react";
import { incidents, knowledgeArticles } from "@/lib/data";
import { downloadText } from "@/lib/download";
import { About } from "./about";
import { Account, type UserSession } from "./account";
import { Analyzer } from "./analyzer";
import { Dashboard } from "./dashboard";
import { Incidents } from "./incidents";
import { Knowledge } from "./knowledge";
import { Pricing, type Plan } from "./pricing";

type View = "overview" | "analyze" | "incidents" | "knowledge" | "reports" | "about" | "pricing" | "account";
const nav = [
  ["overview", BarChart3, "Overview"],
  ["analyze", FileSearch, "New analysis"],
  ["incidents", FolderKanban, "Incidents"],
  ["knowledge", BookOpen, "Knowledge base"],
  ["reports", ShieldCheck, "Reports"]
] as const;

export function Platform() {
  const [view, setView] = useState<View>("overview");
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<UserSession | null>(null);
  const [plan, setPlan] = useState<Plan>("Community");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sme-theme");
    const enabled = stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    const savedUser = localStorage.getItem("sme-user-v1");
    const savedPlan = localStorage.getItem("sme-plan-v1") as Plan | null;
    if (savedUser) {
      try { setUser(JSON.parse(savedUser) as UserSession); } catch { localStorage.removeItem("sme-user-v1"); }
    }
    if (savedPlan && ["Community", "Premium", "Organization"].includes(savedPlan)) setPlan(savedPlan);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === "Escape") {
        setSearch("");
        setNotificationsOpen(false);
        setNavOpen(false);
        if (!isTyping) searchInput.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    if (search.trim().length < 2) return [];
    const term = search.toLowerCase();
    return [
      ...incidents.filter(item => `${item.id} ${item.title} ${item.category}`.toLowerCase().includes(term)).slice(0, 3).map(item => ({ title: item.title, detail: item.id, view: "incidents" as View })),
      ...knowledgeArticles.filter(item => item.join(" ").toLowerCase().includes(term)).slice(0, 3).map(item => ({ title: item[0], detail: "Knowledge guide", view: "knowledge" as View }))
    ];
  }, [search]);

  function notify(message: string) { setToast(message); }
  function navigate(next: View) {
    setView(next);
    setSearch("");
    setNotificationsOpen(false);
    setNavOpen(false);
  }
  function toggleTheme() {
    setDark(value => {
      const next = !value;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("sme-theme", next ? "dark" : "light");
      return next;
    });
  }
  function login(nextUser: UserSession) {
    setUser(nextUser);
    localStorage.setItem("sme-user-v1", JSON.stringify(nextUser));
    notify(`Welcome, ${nextUser.name}.`);
    setView("overview");
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("sme-user-v1");
    notify("You have been signed out.");
  }
  function selectPlan(nextPlan: Plan) {
    if (nextPlan === "Organization") {
      downloadText("organization-plan-request.txt", "Scam Message Explainer - Organization plan inquiry\n\nThank you for your interest. Add your organization, team size, and integration needs before sending this request to sales@example.com.");
      notify("Organization inquiry template downloaded.");
      return;
    }
    setPlan(nextPlan);
    localStorage.setItem("sme-plan-v1", nextPlan);
    notify(`${nextPlan} is now your active plan.`);
  }

  return (
    <>
      {navOpen ? <button className="nav-scrim" aria-label="Close navigation" onClick={() => setNavOpen(false)} /> : null}
      <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
        <aside className={`sidebar ${navOpen ? "open" : ""}`}>
          <button className="brand" onClick={() => navigate("overview")}><div className="brand-mark"><ShieldCheck size={25} /></div><span>Scam Message<br />Explainer</span></button>
          <nav>{nav.map(([id, Icon, label]) => <button title={label} className={view === id ? "active" : ""} onClick={() => navigate(id)} key={id}><Icon size={18} /><span>{label}</span></button>)}</nav>
          <div className="sidebar-links"><button title="Product guide" className={view === "about" ? "active" : ""} onClick={() => navigate("about")}><Info size={18} /><span>Product guide</span></button><button title="Premium" className={view === "pricing" ? "active premium-link" : "premium-link"} onClick={() => navigate("pricing")}><Crown size={18} /><span>Premium</span></button></div>
          <div className="sidebar-bottom">
            <button className="org" onClick={() => navigate("account")}><small>Workspace</small><span><i>{user ? user.name.slice(0, 2).toUpperCase() : "AS"}</i><b>{user?.name ?? "Acme Security"}</b><ChevronDown size={15} /></span></button>
            <button className="collapse" onClick={() => setCollapsed(value => !value)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span>{collapsed ? "Expand" : "Collapse sidebar"}</span></button>
          </div>
        </aside>
        <div className="app-body">
          <header className="topbar">
            <button className="menu-button" aria-label="Open navigation" aria-expanded={navOpen} onClick={() => setNavOpen(true)}><Menu size={21} /></button>
            <div className="global-search"><Search size={17} /><input ref={searchInput} aria-label="Global search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search incidents, messages, guides..." /><kbd>Ctrl K</kbd>{searchResults.length > 0 ? <div className="search-results">{searchResults.map((result, index) => <button key={`${result.title}-${index}`} onClick={() => navigate(result.view)}><Search size={14} /><span><strong>{result.title}</strong><small>{result.detail}</small></span></button>)}</div> : null}</div>
            <div className="top-actions">
              <button onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button aria-label="Product help" onClick={() => navigate("about")}><HelpCircle size={18} /></button>
              <div className="notification-wrap"><button className="notification" aria-label="Notifications" onClick={() => setNotificationsOpen(value => !value)}><Bell size={18} />{unread > 0 ? <i /> : null}</button>{notificationsOpen ? <div className="notifications"><div><strong>Notifications</strong><button onClick={() => setUnread(0)}>Mark all read</button></div><button onClick={() => navigate("incidents")}><span className="alert-icon"><ShieldCheck size={15} /></span><span><strong>High-risk incident detected</strong><small>Package delivery fee required · 18 min ago</small></span></button><button onClick={() => navigate("knowledge")}><span className="info-icon"><BookOpen size={15} /></span><span><strong>New awareness guide</strong><small>AI voice impersonation defenses</small></span></button><button onClick={() => navigate("pricing")}><span className="premium-icon"><Sparkles size={15} /></span><span><strong>Premium intelligence available</strong><small>Unlock unlimited investigations</small></span></button></div> : null}</div>
              <button className="account-button" onClick={() => navigate("account")}>{user ? <span className="avatar">{user.name.slice(0, 2).toUpperCase()}</span> : <><UserRound size={16} /><span>Sign in</span></>}</button>
            </div>
          </header>
          <main>
            {view === "overview" ? <Dashboard onOpen={() => navigate("incidents")} onAnalyze={() => navigate("analyze")} /> : null}
            {view === "analyze" ? <Analyzer onBack={() => navigate("overview")} notify={notify} /> : null}
            {view === "incidents" ? <Incidents notify={notify} /> : null}
            {view === "knowledge" ? <Knowledge /> : null}
            {view === "reports" ? <Reports onAnalyze={() => navigate("analyze")} notify={notify} /> : null}
            {view === "about" ? <About onAnalyze={() => navigate("analyze")} onPremium={() => navigate("pricing")} /> : null}
            {view === "pricing" ? <Pricing plan={plan} onSelect={selectPlan} /> : null}
            {view === "account" ? <Account user={user} onLogin={login} onLogout={logout} /> : null}
          </main>
        </div>
      </div>
      {toast ? <div className="toast" role="status"><ShieldCheck size={17} />{toast}<button onClick={() => setToast("")}><X size={15} /></button></div> : null}
    </>
  );
}

function Reports({ onAnalyze, notify }: { onAnalyze: () => void; notify: (message: string) => void }) {
  const reports = [
    ["INC-2026-2847", "Credential phishing", "Critical", "Today, 10:42"],
    ["INC-2026-2846", "Delivery smishing", "High", "Today, 09:58"],
    ["INC-2026-2844", "Malware attachment", "High", "Yesterday, 16:21"]
  ];
  function downloadReport(report: string[]) {
    downloadText(`${report[0]}-security-report.txt`, `SCAM MESSAGE EXPLAINER\nSECURITY REPORT\n\nIncident: ${report[0]}\nCategory: ${report[1]}\nThreat level: ${report[2]}\nGenerated: ${report[3]}\n\nRecommended action:\nQuarantine the message, preserve evidence, and verify the sender through an independent channel.\n\nThis report is decision support and should be reviewed by a qualified security professional for high-impact cases.`);
    notify(`${report[0]} report downloaded.`);
  }
  return <div className="view animate-fade-up"><div className="view-heading"><div><h1>Security reports</h1><p>Generate shareable, plain-language evidence for stakeholders.</p></div><button className="primary" onClick={onAnalyze}><FileSearch size={17} />Create report</button></div><div className="report-library">{reports.map(report => <div key={report[0]}><span className={`report-level ${report[2].toLowerCase()}`}>{report[2]}</span><div><strong>{report[1]}</strong><small>{report[0]} · {report[3]}</small></div><button className="ghost" onClick={() => downloadReport(report)}><Download size={15} />Download</button></div>)}</div><div className="report-help"><CircleHelp size={20} /><div><strong>Need a new report?</strong><p>Every completed analysis automatically produces an executive summary, technical evidence, scoring rationale, and response plan.</p></div><button className="text-button" onClick={onAnalyze}>Start analysis →</button></div></div>;
}
