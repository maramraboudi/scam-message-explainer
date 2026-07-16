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
  ["overview", BarChart3, "Command center"],
  ["analyze", FileSearch, "Triage desk"],
  ["incidents", FolderKanban, "Case queue"],
  ["knowledge", BookOpen, "Field notes"],
  ["reports", ShieldCheck, "Briefings"]
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
      ...incidents.filter(item => `${item.id} ${item.title} ${item.sender} ${item.category}`.toLowerCase().includes(term)).slice(0, 3).map(item => ({ title: item.title, detail: item.id, view: "incidents" as View })),
      ...knowledgeArticles.filter(item => item.join(" ").toLowerCase().includes(term)).slice(0, 3).map(item => ({ title: item[0], detail: "Field note", view: "knowledge" as View }))
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
      downloadText("signalproof-team-request.txt", "SignalProof - Team workspace inquiry\n\nAdd your organization, team size, case volume, and integration needs before sending this request to partnerships@signalproof.example.");
      notify("Team workspace inquiry downloaded.");
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
          <button className="brand" onClick={() => navigate("overview")}><div className="brand-mark"><span className="brand-monogram">SP</span></div><span>SignalProof<br /><small>Trust desk</small></span></button>
          <nav>{nav.map(([id, Icon, label]) => <button title={label} className={view === id ? "active" : ""} onClick={() => navigate(id)} key={id}><Icon size={18} /><span>{label}</span></button>)}</nav>
          <div className="sidebar-links"><button title="Product guide" className={view === "about" ? "active" : ""} onClick={() => navigate("about")}><Info size={18} /><span>Method</span></button><button title="Plans" className={view === "pricing" ? "active premium-link" : "premium-link"} onClick={() => navigate("pricing")}><Crown size={18} /><span>Plans</span></button></div>
          <div className="sidebar-bottom">
            <button className="org" onClick={() => navigate("account")}><small>Workspace</small><span><i>{user ? user.name.slice(0, 2).toUpperCase() : "NM"}</i><b>{user?.name ?? "Northstar Mutual"}</b><ChevronDown size={15} /></span></button>
            <button className="collapse" onClick={() => setCollapsed(value => !value)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span>{collapsed ? "Expand" : "Collapse sidebar"}</span></button>
          </div>
        </aside>
        <div className="app-body">
          <header className="topbar">
            <button className="menu-button" aria-label="Open navigation" aria-expanded={navOpen} onClick={() => setNavOpen(true)}><Menu size={21} /></button>
            <div className="global-search"><Search size={17} /><input ref={searchInput} aria-label="Global search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search cases, senders, playbooks..." /><kbd>Ctrl K</kbd>{searchResults.length > 0 ? <div className="search-results">{searchResults.map((result, index) => <button key={`${result.title}-${index}`} onClick={() => navigate(result.view)}><Search size={14} /><span><strong>{result.title}</strong><small>{result.detail}</small></span></button>)}</div> : null}</div>
            <div className="top-actions">
              <button onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button aria-label="Product help" onClick={() => navigate("about")}><HelpCircle size={18} /></button>
              <div className="notification-wrap"><button className="notification" aria-label="Notifications" onClick={() => setNotificationsOpen(value => !value)}><Bell size={18} />{unread > 0 ? <i /> : null}</button>{notificationsOpen ? <div className="notifications"><div><strong>Signal queue</strong><button onClick={() => setUnread(0)}>Mark all read</button></div><button onClick={() => navigate("incidents")}><span className="alert-icon"><ShieldCheck size={15} /></span><span><strong>Harbor Bank lookalike escalated</strong><small>Maya Chen assigned - 10 min ago</small></span></button><button onClick={() => navigate("knowledge")}><span className="info-icon"><BookOpen size={15} /></span><span><strong>New field note published</strong><small>Synthetic voice verification checklist</small></span></button><button onClick={() => navigate("pricing")}><span className="premium-icon"><Sparkles size={15} /></span><span><strong>Team desk controls available</strong><small>Add review roles and audit history</small></span></button></div> : null}</div>
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
    ["SP-0717-042", "Harbor Bank lookalike reset", "Critical", "Today, 10:42"],
    ["SP-0717-039", "Roadrunner customs-fee text", "High", "Today, 09:58"],
    ["SP-0717-029", "Northwind macro invoice", "High", "Yesterday, 16:21"]
  ];
  function downloadReport(report: string[]) {
    downloadText(`${report[0]}-signalproof-briefing.txt`, `SIGNALPROOF\nCASE BRIEFING\n\nCase: ${report[0]}\nSubject: ${report[1]}\nThreat level: ${report[2]}\nGenerated: ${report[3]}\n\nRecommended action:\nHold the message, preserve evidence, and verify the sender through an independent channel.\n\nThis briefing supports triage decisions and should be reviewed by the assigned trust-and-safety owner for high-impact cases.`);
    notify(`${report[0]} briefing downloaded.`);
  }
  return <div className="view animate-fade-up"><div className="view-heading"><div><h1>Case briefings</h1><p>Export concise evidence packets for fraud, support, and operations teams.</p></div><button className="primary" onClick={onAnalyze}><FileSearch size={17} />Create briefing</button></div><div className="report-library">{reports.map(report => <div key={report[0]}><span className={`report-level ${report[2].toLowerCase()}`}>{report[2]}</span><div><strong>{report[1]}</strong><small>{report[0]} - {report[3]}</small></div><button className="ghost" onClick={() => downloadReport(report)}><Download size={15} />Download</button></div>)}</div><div className="report-help"><CircleHelp size={20} /><div><strong>Need a fresh briefing?</strong><p>Every completed triage produces an executive summary, evidence highlights, scoring rationale, and response checklist.</p></div><button className="text-button" onClick={onAnalyze}>Start triage</button></div></div>;
}
