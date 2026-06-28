"use client";
import { useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronRight, Clipboard, FileImage, FileText, Link2, Loader2, LockKeyhole, MessageSquareText, ShieldAlert, Sparkles, Upload, X, XCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { Panel, PanelTitle, ScoreRing } from "./ui";

const demo = "URGENT: Your Microsoft account will be suspended within 24 hours. Verify your account and password immediately at https://bit.ly/secure-login to avoid losing access. Failure to act may result in permanent closure.";

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
        headers: { "Content-Type": "application/json", "X-Requested-With": "ScamMessageExplainer" },
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

  if (result) return <Report result={result} onReset={() => setResult(null)} tab={tab} setTab={setTab} notify={notify} />;

  return (
    <div className="view analyzer-view animate-fade-up">
      <button className="back-button" onClick={onBack}><ArrowLeft size={17} />Back to overview</button>
      <div className="analysis-heading"><div><h1>Analyze suspicious content</h1><p>Paste a message, URL, or upload evidence. Your content is processed securely and is not retained in this demo.</p></div><div className="privacy-note"><LockKeyhole size={17} /><span><strong>Private by design</strong>Encrypted in transit · no training use</span></div></div>
      <div className="analysis-layout">
        <Panel className="submission-panel">
          <div className="source-tabs" role="tablist">{["Email", "SMS", "WhatsApp", "Social", "URL", "Other"].map(item => <button role="tab" aria-selected={source === item} className={source === item ? "active" : ""} onClick={() => setSource(item)} key={item}>{item}</button>)}</div>
          <label className="input-label" htmlFor="message">Message content</label>
          <div className="textarea-wrap">
            <textarea id="message" value={content} onChange={event => setContent(event.target.value.slice(0, 12000))} placeholder="Paste the suspicious message here, including any links, sender details, or context…" />
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
            <button className="upload" onClick={() => fileInput.current?.click()}><Upload size={18} /><span><strong>{attachment ? attachment.name : "Add evidence"}</strong><small>{attachment ? `${(attachment.size / 1024).toFixed(0)} KB · ready to attach` : "Screenshot, QR code, or PDF · max 10 MB"}</small></span></button>
            <div className="supported"><FileImage size={17} /><FileText size={17} /><Link2 size={17} /></div>
          </div>
          <div className="submit-row"><button className="ghost" onClick={() => setContent(demo)}><Sparkles size={16} />Load demo example</button><button className="primary analyze-button" onClick={analyze} disabled={loading}>{loading ? <><Loader2 className="spin" size={17} />Analyzing safely…</> : <><ShieldAlert size={17} />Analyze threat</>}</button></div>
          {loading ? <div className="scan-progress"><i /><span>Inspecting language, URLs, identity cues, and manipulation patterns…</span></div> : null}
        </Panel>
        <aside className="analysis-aside">
          <h2>What we inspect</h2>
          <p>Every signal is translated into plain language and weighted by reliability.</p>
          {[
            [MessageSquareText, "Language & intent", "Urgency, threats, rewards, impersonation"],
            [Link2, "Links & domains", "Shorteners, lookalikes, redirects, reputation"],
            [LockKeyhole, "Credential risk", "Login requests, OTPs, payment details"],
            [FileImage, "Files & QR codes", "Attachments, hidden links, malware cues"]
          ].map(([Icon, title, text]) => {
            const ItemIcon = Icon as typeof MessageSquareText;
            return <div className="inspect-item" key={String(title)}><ItemIcon size={19} /><span><strong>{String(title)}</strong><small>{String(text)}</small></span></div>;
          })}
          <div className="safety-tip"><CheckCircle2 size={18} /><span><strong>Safe handling</strong>We never open submitted links or execute attachments in your browser.</span></div>
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
    notify("Security summary copied to clipboard.");
  }
  return (
    <div className="view report-view animate-fade-up">
      <div className="report-toolbar"><button className="back-button" onClick={onReset}><ArrowLeft size={17} />New analysis</button><div><button className="ghost" onClick={copySummary}><Clipboard size={16} />Copy summary</button><button className="primary" onClick={() => { notify("Print dialog opened. Choose “Save as PDF” to export."); setTimeout(() => window.print(), 150); }}><FileText size={16} />Export PDF</button></div></div>
      <div className="report-hero">
        <ScoreRing score={result.score} />
        <div><div className="report-id">{result.id} · Analysis complete</div><h1>{result.threatLevel} risk: {result.category}</h1><p>{result.summary}</p><div className="confidence"><span>Confidence</span><div><i style={{ width: `${result.confidence}%` }} /></div><strong>{result.confidence}%</strong></div></div>
        <div className="report-verdict"><ShieldAlert size={22} /><span><strong>Recommended decision</strong>Quarantine and verify independently</span></div>
      </div>
      <div className="report-tabs">{(["overview", "technical", "response"] as const).map(item => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item === "overview" ? "Executive overview" : item === "technical" ? "Technical analysis" : "Response plan"}</button>)}</div>
      {tab === "overview" ? <div className="report-grid">
        <Panel className="findings"><PanelTitle>Why this was flagged</PanelTitle>{result.findings.map(finding => <div className="finding" key={finding.id}><div className={`finding-icon ${finding.severity.toLowerCase()}`}><AlertTriangle size={17} /></div><div><strong>{finding.title}</strong><p>{finding.explanation}</p><small>Evidence: “{finding.evidence}”</small></div><b>+{finding.points}</b></div>)}</Panel>
        <Panel className="risk-breakdown"><PanelTitle>Risk breakdown</PanelTitle><div className="risk-total"><span>Base signal score</span><strong>{result.score} / 100</strong></div>{result.findings.map(item => <div className="breakdown-row" key={item.id}><span>{item.title}</span><div><i style={{ width: `${Math.min(100, item.points * 3.6)}%` }} /></div><b>+{item.points}</b></div>)}</Panel>
        <Panel className="evidence-panel"><PanelTitle>Highlighted evidence</PanelTitle><div className="evidence-text" dangerouslySetInnerHTML={{ __html: result.highlightedText }} /></Panel>
        <Panel className="quick-actions"><PanelTitle>Do this now</PanelTitle>{result.immediateActions.slice(0, 3).map(action => <div key={action}><Check size={16} /><span>{action}</span><ChevronRight size={16} /></div>)}</Panel>
      </div> : null}
      {tab === "technical" ? <div className="technical-list">{result.findings.map(finding => <Panel key={finding.id}><div className="technical-head"><span className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</span><strong>{finding.title}</strong><b>+{finding.points} risk points</b></div><p>{finding.explanation}</p><code>{finding.evidence}</code></Panel>)}</div> : null}
      {tab === "response" ? <div className="response-grid">
        <Panel><PanelTitle>Immediate actions</PanelTitle>{result.immediateActions.map(action => <Action key={action} icon={CheckCircle2} text={action} good />)}</Panel>
        <Panel><PanelTitle>Things not to do</PanelTitle>{result.avoidActions.map(action => <Action key={action} icon={XCircle} text={action} />)}</Panel>
        <Panel><PanelTitle>Prevent this next time</PanelTitle>{result.preventionTips.map(action => <Action key={action} icon={Check} text={action} good />)}</Panel>
      </div> : null}
    </div>
  );
}

function Action({ icon: Icon, text, good = false }: { icon: typeof X; text: string; good?: boolean }) {
  return <div className={`action-item ${good ? "good" : ""}`}><Icon size={18} /><span>{text}</span></div>;
}
