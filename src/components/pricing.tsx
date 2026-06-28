"use client";
import { Check, Crown, ShieldCheck, Sparkles, Users } from "lucide-react";

export type Plan = "Community" | "Premium" | "Organization";

export function Pricing({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
  const plans = [
    { name: "Community" as const, price: "Free", description: "Essential protection for individuals.", icon: ShieldCheck, features: ["10 analyses per month", "Explainable risk reports", "Knowledge center", "Local report export"] },
    { name: "Premium" as const, price: "€9", suffix: "/ month", description: "Always-on protection for families and power users.", icon: Crown, featured: true, features: ["Unlimited analyses", "Screenshot, QR, and PDF intake", "Incident history and bookmarks", "Advanced URL intelligence", "Priority guidance"] },
    { name: "Organization" as const, price: "Custom", description: "Collaborative operations for security teams.", icon: Users, features: ["Shared investigation workspace", "Roles and audit history", "SSO and policy controls", "SIEM and help-desk integrations", "Dedicated support"] }
  ];
  return (
    <div className="view pricing-view animate-fade-up">
      <div className="pricing-heading"><Sparkles size={28} /><h1>Protection that grows with you</h1><p>Start free. Upgrade when you need unlimited investigations, richer intelligence, and team operations.</p></div>
      <div className="pricing-grid">{plans.map(item => {
        const Icon = item.icon;
        const selected = plan === item.name;
        return <article key={item.name} className={item.featured ? "featured" : ""}>
          {item.featured ? <div className="recommended">Most popular</div> : null}
          <Icon size={24} /><h2>{item.name}</h2><p>{item.description}</p><div className="price"><strong>{item.price}</strong>{item.suffix ? <span>{item.suffix}</span> : null}</div>
          <button className={item.featured ? "primary" : "ghost"} onClick={() => onSelect(item.name)} disabled={selected}>{selected ? "Current plan" : item.name === "Organization" ? "Contact sales" : `Choose ${item.name}`}</button>
          <ul>{item.features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
        </article>;
      })}</div>
      <div className="pricing-note"><ShieldCheck size={18} /><span><strong>Transparent billing</strong>No setup fees. Cancel Premium any time. Organization plans are scoped to your security and compliance needs.</span></div>
    </div>
  );
}
