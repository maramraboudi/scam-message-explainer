import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function PanelTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="panel-title"><h2>{children}</h2>{action}</div>;
}

export function Metric({ label, value, delta, icon: Icon, tone }: { label: string; value: string; delta: string; icon: LucideIcon; tone: "blue" | "red" | "green" | "amber" }) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}><Icon size={20} /></div>
      <div><span>{label}</span><strong>{value}</strong><small className={tone === "red" ? "down" : "up"}>{delta}</small></div>
    </div>
  );
}

export function Status({ children }: { children: ReactNode }) {
  const key = String(children).toLowerCase();
  return <span className={`status ${key}`}>{children}</span>;
}

export function ScoreRing({ score, label = "Risk score", size = "large" }: { score: number; label?: string; size?: "large" | "small" }) {
  const color = score >= 75 ? "#f04452" : score >= 50 ? "#f59e0b" : score >= 25 ? "#135ef2" : "#19a987";
  return (
    <div className={`score-ring ${size}`} style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--track) 0deg)` }}>
      <div><strong>{score}</strong><span>{label}</span></div>
    </div>
  );
}
