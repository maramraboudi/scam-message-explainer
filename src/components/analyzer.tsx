"use client";
import { useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronRight, Clipboard, FileImage, FileText, Link2, Loader2, LockKeyhole, MessageSquareText, ShieldAlert, Sparkles, Upload, X, XCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { Panel, PanelTitle, ScoreRing } from "./ui";

const sample = "Harbor Bank Alert: We blocked a suspicious sign-in to your payroll profile. Confirm your password within 24 hours at https://bit.ly/harbor-payroll-review or your ACH access will be paused.";

export function Analyzer({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  const [content, setContent] = useState("");
  const [source, setSource] = useState("Email");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"overview" | "technical" | "response">("overview");

  async function analyze() {
    setError("");
    if (content.trim().length < 8) return setError("Paste a message or URL with at least 8 characters.");
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "SignalProof" },
        body: JSON.stringify({ content, source })
      });
      const data = await response.json() as AnalysisResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Analysis failed.");
      setResult(data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setContent(sample);
    setSource("Email");
    setAttachment(null);
    setError("");
  }

  function resetAnalysis() {
    setResult(null);
    setTab("overview");
    setError("");
  }

  if (result) return <Report result={result} onReset={resetAnalysis} tab={tab} setTab={setTab} notify={notify} />;

  return (
    <div className="view analyzer-view animate-fade-up">
      <button className="back-button" onClick={onBack}><ArrowLeft size={17} />Back to command center</button>
      <div className="analysis-heading"><div><h1>Triage a suspicious message</h1><p>Paste the exact message, sender, or URL. SignalProof keeps the evidence local to this workspace session.</p></div><div className="privacy-note"><LockKeyhole size={17} /><span><strong>Evidence stays private</strong>Processed in session - no training use</span></div></div>
      <div className="analysis-layout">
        <Panel className="submission-panel">
          <div className="source-tabs" role="tablist">{["Email", "SMS", "WhatsApp", "Social", "URL", "Other"].map(item => <button role="tab" aria-selected={source === item} className={source === item ? "active" : ""} onClick={() => setSource(item)} key={item}>{item}</button>)}</div>
          <label className="input-label" htmlFor="message">Evidence text</label>
          <div className="textarea-wrap">
            <textarea id="message" value={content} onChange={event => setContent(event.target.value.slice(0, 12000))} placeholder="Paste the message exactly as received, including sender, link, phone number, and surrounding context..." />
            <span>{content.length.toLocaleString()} / 12,000</span>
          </div>
          {error ? <p className="form-error"><AlertTriangle size={15} />{error}</p> : null}
          <div className="upload-row">
            <input ref={fileInput} type="file" hidden accept="image/png,image/jpeg,image/webp,application/pdf" onChange={event => {
              const file = event.target.files?.[0] ?? null;
              if (file && file.size > 10 * 1024 * 1024) {
                setError("Evidence files must be 10 MB or smaller.");
                event.target.value = "";
                return;
              }
              setError("");
              setAttachment(file);
            }} />
            <button className="upload" onClick={() => fileInput.current?.click()}><Upload size={18} /><span><strong>{attachment ? attachment.name : "Attach evidence"}</strong><small>{attachment ? `${(attachment.size / 1024).toFixed(0)} KB - linked to this case` : "Screenshot, QR code, or PDF - max 10 MB"}</small></span></button>
            {attachment ? <button className="remove-evidence" aria-label="Remove selected evidence" onClick={() => { setAttachment(null); if (fileInput.current) fileInput.current.value = ""; }}><X size={15} /></button> : null}
            <div className="supported"><FileImage size={17} /><FileText size={17} /><Link2 size={17} /></div>
          </div>
          {attachment ? <p className="evidence-note">Attachment retained as case context. This local rule engine scores the pasted text and visible URLs.</p> : null}
          <div className="submit-row"><button className="ghost" onClick={loadSample}><Sparkles size={16} />Load Harbor Bank sample</button><button className="primary analyze-button" onClick={analyze} disabled={loading}>{loading ? <><Loader2 className="spin" size={17} />Scoring evidence...</> : <><ShieldAlert size={17} />Run triage</>}</button></div>
          {loading ? <div className="scan-progress"><i /><span>Checking pressure language, sender claims, links, money movement, and account-access cues...</span></div> : null}
        </Panel>
        <aside className="analysis-aside">
          <h2>SignalProof checks</h2>
          <p>Each finding stays traceable to visible text so reviewers can explain the decision.</p>
          {[
            [MessageSquareText, "Pressure & intent", "Urgency, threats, rewards, secrecy"],
            [Link2, "Destination risk", "Shorteners, lookalikes, redirects"],
            [LockKeyhole, "Account exposure", "Passwords, OTPs, payroll, banking"],
            [FileImage, "Evidence context", "Screenshots, QR codes, attachments"]
          ].map(([Icon, title, text]) => {
            const ItemIcon = Icon as typeof MessageSquareText;
            return <div className="inspect-item" key={String(title)}><ItemIcon size={19} /><span><strong>{String(title)}</strong><small>{String(text)}</small></span></div>;
          })}
          <div className="safety-tip"><CheckCircle2 size={18} /><span><strong>Reviewer rule</strong>Do not open links or run files while a case is untrusted.</span></div>
        </aside>
      </div>
    </div>
  );
}

function Report({ result, onReset, tab, setTab, notify }: { result: AnalysisResult; onReset: () => void; tab: "overview" | "technical" | "response"; setTab: (tab: "overview" | "technical" | "response") => void; notify: (message: string) => void }) {
  async function copySummary() {
    const text = `${result.threatLevel} risk: ${result.category}\nRisk score: ${result.score}/100\nConfidence: ${result.confidence}%\n\n${result.summary}\n\nImmediate actions:\n${result.immediateActions.map(item => `- ${item}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    notify("Case summary copied to clipboard.");
  }
  return (
    <div className="view report-view animate-fade-up">
      <div className="report-toolbar"><button className="back-button" onClick={onReset}><ArrowLeft size={17} />New triage</button><div><button className="ghost" onClick={copySummary}><Clipboard size={16} />Copy summary</button><button className="primary" onClick={() => { notify("Print dialog opened. Choose Save as PDF to export."); setTimeout(() => window.print(), 150); }}><FileText size={16} />Export PDF</button></div></div>
      <div className="report-hero">
        <ScoreRing score={result.score} />
        <div><div className="report-id">{result.id} - Triage complete</div><h1>{result.threatLevel} risk: {result.category}</h1><p>{result.summary}</p><div className="confidence"><span>Confidence</span><div><i style={{ width: `${result.confidence}%` }} /></div><strong>{result.confidence}%</strong></div></div>
        <div className="report-verdict"><ShieldAlert size={22} /><span><strong>Recommended decision</strong>Hold and verify out-of-band</span></div>
      </div>
      <div className="report-tabs">{(["overview", "technical", "response"] as const).map(item => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item === "overview" ? "Reviewer summary" : item === "technical" ? "Signal trace" : "Response plan"}</button>)}</div>
      {tab === "overview" ? <div className="report-grid">
        <Panel className="findings"><PanelTitle>Why SignalProof flagged it</PanelTitle>{result.findings.map(finding => <div className="finding" key={finding.id}><div className={`finding-icon ${finding.severity.toLowerCase()}`}><AlertTriangle size={17} /></div><div><strong>{finding.title}</strong><p>{finding.explanation}</p><small>Evidence: <q>{finding.evidence}</q></small></div><b>+{finding.points}</b></div>)}</Panel>
        <Panel className="risk-breakdown"><PanelTitle>Risk breakdown</PanelTitle><div className="risk-total"><span>Signal score</span><strong>{result.score} / 100</strong></div>{result.findings.map(item => <div className="breakdown-row" key={item.id}><span>{item.title}</span><div><i style={{ width: `${Math.min(100, item.points * 3.6)}%` }} /></div><b>+{item.points}</b></div>)}</Panel>
        <Panel className="evidence-panel"><PanelTitle>Highlighted evidence</PanelTitle><div className="evidence-text" dangerouslySetInnerHTML={{ __html: result.highlightedText }} /></Panel>
        <Panel className="quick-actions"><PanelTitle>Next moves</PanelTitle>{result.immediateActions.slice(0, 3).map(action => <div key={action}><Check size={16} /><span>{action}</span><ChevronRight size={16} /></div>)}</Panel>
      </div> : null}
      {tab === "technical" ? <div className="technical-list">{result.findings.map(finding => <Panel key={finding.id}><div className="technical-head"><span className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</span><strong>{finding.title}</strong><b>+{finding.points} risk points</b></div><p>{finding.explanation}</p><code>{finding.evidence}</code></Panel>)}</div> : null}
      {tab === "response" ? <div className="response-grid">
        <Panel><PanelTitle>Immediate actions</PanelTitle>{result.immediateActions.map(action => <Action key={action} icon={CheckCircle2} text={action} good />)}</Panel>
        <Panel><PanelTitle>Do not do this</PanelTitle>{result.avoidActions.map(action => <Action key={action} icon={XCircle} text={action} />)}</Panel>
        <Panel><PanelTitle>Prevent repeats</PanelTitle>{result.preventionTips.map(action => <Action key={action} icon={Check} text={action} good />)}</Panel>
      </div> : null}
    </div>
  );
}

function Action({ icon: Icon, text, good = false }: { icon: typeof X; text: string; good?: boolean }) {
  return <div className={`action-item ${good ? "good" : ""}`}><Icon size={18} /><span>{text}</span></div>;
}
