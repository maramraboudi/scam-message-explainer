"use client";
import { ArrowRight, BookOpenCheck, FileSearch, Fingerprint, Gauge, Network, ShieldCheck, Users } from "lucide-react";
import { Panel } from "./ui";

export function About({ onAnalyze, onPremium }: { onAnalyze: () => void; onPremium: () => void }) {
  const workflow = [
    [FileSearch, "Submit evidence", "Paste a message or URL, or attach a screenshot, QR image, or PDF for investigation."],
    [Fingerprint, "Inspect the signals", "The engine weighs language, identity, links, payment requests, attachments, and manipulation techniques."],
    [Gauge, "Understand the risk", "Every score is broken into explainable findings with direct evidence and confidence."],
    [ShieldCheck, "Respond safely", "Follow a prioritized response plan, preserve evidence, and export a stakeholder-ready report."]
  ] as const;
  return (
    <div className="view product-guide animate-fade-up">
      <div className="guide-hero">
        <div>
          <h1>Security guidance people can actually use.</h1>
          <p>Scam Message Explainer turns suspicious messages into clear decisions for individuals, security teams, schools, banks, telecom operators, and public services.</p>
          <div><button className="primary" onClick={onAnalyze}>Analyze a message <ArrowRight size={16} /></button><button className="ghost" onClick={onPremium}>Explore Premium</button></div>
        </div>
        <div className="guide-trust"><ShieldCheck size={45} /><strong>Explainable by design</strong><span>Every verdict includes evidence, scoring logic, and a practical response plan.</span></div>
      </div>
      <div className="guide-section"><h2>From uncertainty to action</h2><p>A complete investigation workflow, designed for non-technical users and security professionals alike.</p></div>
      <div className="workflow-grid">{workflow.map(([Icon, title, text], index) => <Panel key={title}><span>0{index + 1}</span><Icon size={22} /><h3>{title}</h3><p>{text}</p></Panel>)}</div>
      <div className="capability-band">
        <div><Network size={24} /><h3>Multi-channel intelligence</h3><p>Email, SMS, WhatsApp, social platforms, URLs, QR codes, screenshots, and documents.</p></div>
        <div><BookOpenCheck size={24} /><h3>Built-in education</h3><p>Plain-language explanations turn every incident into a practical awareness lesson.</p></div>
        <div><Users size={24} /><h3>Team-ready operations</h3><p>Incident status, history, bookmarks, exports, and executive reporting in one workspace.</p></div>
      </div>
      <div className="security-principles"><div><h2>Built around trust</h2><p>Security products should minimize data, explain decisions, and never hide uncertainty.</p></div><ul><li><ShieldCheck size={17} />Submitted content is not persisted by the included local engine.</li><li><ShieldCheck size={17} />Findings are evidence-backed and never presented as certainty.</li><li><ShieldCheck size={17} />Sensitive actions are routed through independent verification.</li><li><ShieldCheck size={17} />Exports are generated locally in your browser.</li></ul></div>
    </div>
  );
}
