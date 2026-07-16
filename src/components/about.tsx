"use client";
import { ArrowRight, BookOpenCheck, FileSearch, Fingerprint, Gauge, Network, ShieldCheck, Users } from "lucide-react";
import { Panel } from "./ui";

export function About({ onAnalyze, onPremium }: { onAnalyze: () => void; onPremium: () => void }) {
  const workflow = [
    [FileSearch, "Capture the exact route", "Paste the message, sender, destination, and context before anyone opens the link."],
    [Fingerprint, "Trace the trust claim", "SignalProof weighs identity cues, pressure language, links, files, payments, and account exposure."],
    [Gauge, "Score the signal", "Every risk score is tied to visible evidence, confidence, and a reviewer-friendly rationale."],
    [ShieldCheck, "Close the loop", "Export a briefing, preserve evidence, and verify through a channel the attacker does not control."]
  ] as const;
  return (
    <div className="view product-guide animate-fade-up">
      <div className="guide-hero">
        <div>
          <h1>Message triage with a human audit trail.</h1>
          <p>SignalProof turns suspicious messages into named cases, clear evidence, and out-of-band verification steps for trust, support, and operations teams.</p>
          <div><button className="primary" onClick={onAnalyze}>Open triage <ArrowRight size={16} /></button><button className="ghost" onClick={onPremium}>View plans</button></div>
        </div>
        <div className="guide-trust"><ShieldCheck size={45} /><strong>Evidence first</strong><span>Every decision shows the phrase, sender, or link that raised the risk.</span></div>
      </div>
      <div className="guide-section"><h2>From noisy messages to named cases</h2><p>A compact workflow designed for reviewers who need to move quickly without hiding uncertainty.</p></div>
      <div className="workflow-grid">{workflow.map(([Icon, title, text], index) => <Panel key={title}><span>0{index + 1}</span><Icon size={22} /><h3>{title}</h3><p>{text}</p></Panel>)}</div>
      <div className="capability-band">
        <div><Network size={24} /><h3>Route-aware review</h3><p>Email, SMS, WhatsApp, social DMs, URLs, QR codes, screenshots, and documents.</p></div>
        <div><BookOpenCheck size={24} /><h3>Reusable field notes</h3><p>Every case can become a short lesson for support agents, customers, or internal teams.</p></div>
        <div><Users size={24} /><h3>Case ownership</h3><p>Owners, saved cases, exports, and briefings keep the handoff practical.</p></div>
      </div>
      <div className="security-principles"><div><h2>Built around reviewer trust</h2><p>A good triage tool should minimize data, explain decisions, and never pretend uncertainty disappeared.</p></div><ul><li><ShieldCheck size={17} />Submitted content is not persisted by the included local engine.</li><li><ShieldCheck size={17} />Findings are evidence-backed and never presented as certainty.</li><li><ShieldCheck size={17} />Sensitive actions are routed through independent verification.</li><li><ShieldCheck size={17} />Exports are generated locally in your browser.</li></ul></div>
    </div>
  );
}
