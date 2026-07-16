"use client";
import { Activity, Ban, Clock3, FileSearch, MoreHorizontal, ShieldCheck } from "lucide-react";
import { incidents } from "@/lib/data";
import { Distribution, ThreatChart } from "./charts";
import { Metric, Panel, PanelTitle, Status } from "./ui";

export function Dashboard({ onOpen, onAnalyze }: { onOpen: () => void; onAnalyze: () => void }) {
  return (
    <div className="view animate-fade-up">
      <div className="view-heading"><div><h1>Signal command center</h1><p>Live trust-and-safety triage for suspicious messages, senders, and payment requests.</p></div><button className="primary" onClick={onAnalyze}><FileSearch size={17} />Open triage</button></div>
      <div className="metrics">
        <Metric label="Signals reviewed" value="2,847" delta="+18.6% this month" icon={Activity} tone="blue" />
        <Metric label="Critical cases" value="184" delta="+12.3% this month" icon={Ban} tone="red" />
        <Metric label="Verified safe" value="96.4%" delta="+4.8% this month" icon={ShieldCheck} tone="green" />
        <Metric label="Median triage" value="1.8s" delta="-0.4s this month" icon={Clock3} tone="blue" />
      </div>
      <div className="dashboard-grid">
        <Panel className="activity-panel">
          <PanelTitle action={<div className="legend-inline"><span><i className="risk-dot" />Escalated</span><span><i className="safe-dot" />Cleared</span><button className="ghost compact">Last 30 days</button></div>}>Signal activity</PanelTitle>
          <ThreatChart />
        </Panel>
        <Panel className="distribution-panel"><PanelTitle>Risk distribution</PanelTitle><Distribution /></Panel>
        <Panel className="incidents-panel">
          <PanelTitle action={<button className="text-button" onClick={onOpen}>Open case queue</button>}>Recent case work</PanelTitle>
          <div className="table-scroll"><table>
            <thead><tr><th>Case</th><th>Sender</th><th>Category</th><th>Owner</th><th>Risk</th><th>Status</th><th>Updated</th><th aria-label="Actions" /></tr></thead>
            <tbody>{incidents.map((item, index) => <tr key={item.id} className={index === 1 ? "selected" : ""} onClick={onOpen}>
              <td><span className={`risk-rail r${Math.floor(item.risk / 25)}`} /><strong>{item.id}</strong><small>{item.title}</small></td>
              <td>{item.sender}</td><td>{item.category}</td><td>{item.owner}</td><td><b className={item.risk > 75 ? "risk-text" : ""}>{item.risk}</b><small>/100</small></td><td><Status>{item.status}</Status></td><td>{item.updated}</td><td><MoreHorizontal size={17} /></td>
            </tr>)}</tbody>
          </table></div>
        </Panel>
        <Panel className="vectors-panel">
          <PanelTitle>Signal sources</PanelTitle>
          <div className="bars">{[
            ["Lookalike domains", 88, "1,024"], ["Delivery texts", 68, "842"], ["Payment changes", 52, "512"], ["Macro invoices", 34, "241"], ["Social takeover", 24, "126"]
          ].map(([name, width, count], i) => <div className="bar-row" key={name}><b>{i + 1}</b><span>{name}</span><div><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></div>)}</div>
        </Panel>
      </div>
    </div>
  );
}
