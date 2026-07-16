"use client";
import { Check, Crown, ShieldCheck, Sparkles, Users } from "lucide-react";

export type Plan = "Community" | "Premium" | "Organization";

export function Pricing({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
  const plans = [
    { name: "Community" as const, price: "Free", description: "Solo review for personal inboxes and small teams.", icon: ShieldCheck, features: ["10 triage runs per month", "Explainable case briefings", "Field note library", "Local export"] },
    { name: "Premium" as const, price: "EUR 9", suffix: "/ month", description: "Faster triage for families, creators, and high-volume support desks.", icon: Crown, featured: true, features: ["Unlimited triage runs", "Screenshot, QR, and PDF context", "Saved cases and bookmarks", "Advanced URL signal notes", "Priority reviewer checklists"] },
    { name: "Organization" as const, price: "Custom", description: "Case operations for trust-and-safety and fraud teams.", icon: Users, features: ["Shared case queue", "Reviewer roles and audit history", "SSO and policy controls", "SIEM and help-desk handoff", "Dedicated onboarding"] }
  ];
  return (
    <div className="view pricing-view animate-fade-up">
      <div className="pricing-heading"><Sparkles size={28} /><h1>Plans for real review work</h1><p>Start with local triage. Upgrade when you need saved ownership, richer context, and team handoff.</p></div>
      <div className="pricing-grid">{plans.map(item => {
        const Icon = item.icon;
        const selected = plan === item.name;
        return <article key={item.name} className={item.featured ? "featured" : ""}>
          {item.featured ? <div className="recommended">Most useful</div> : null}
          <Icon size={24} /><h2>{item.name}</h2><p>{item.description}</p><div className="price"><strong>{item.price}</strong>{item.suffix ? <span>{item.suffix}</span> : null}</div>
          <button className={item.featured ? "primary" : "ghost"} onClick={() => onSelect(item.name)} disabled={selected}>{selected ? "Current plan" : item.name === "Organization" ? "Request team workspace" : `Choose ${item.name}`}</button>
          <ul>{item.features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
        </article>;
      })}</div>
      <div className="pricing-note"><ShieldCheck size={18} /><span><strong>Plain terms</strong>No setup fees. Cancel Premium any time. Organization workspaces are scoped around your case volume and review policy.</span></div>
    </div>
  );
}
