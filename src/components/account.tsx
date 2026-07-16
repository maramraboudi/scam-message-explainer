"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole, Mail, ShieldCheck, UserPlus } from "lucide-react";

export interface UserSession { name: string; email: string }

export function Account({ user, onLogin, onLogout }: { user: UserSession | null; onLogin: (user: UserSession) => void; onLogout: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (mode === "signup" && name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must contain at least 8 characters.");
    onLogin({ name: mode === "signup" ? name.trim() : email.split("@")[0], email });
  }
  if (user) return <div className="view account-view animate-fade-up"><div className="account-card signed-in"><div className="account-avatar">{user.name.slice(0, 2).toUpperCase()}</div><h1>{user.name}</h1><p>{user.email}</p><span><CheckCircle2 size={16} />Northstar Mutual workspace active</span><div className="account-details"><div><small>Authentication</small><strong>Local secure session</strong></div><div><small>Workspace role</small><strong>Trust reviewer</strong></div><div><small>Multi-factor authentication</small><strong>Recommended</strong></div></div><button className="ghost" onClick={onLogout}>Sign out</button></div></div>;
  return (
    <div className="view account-view animate-fade-up">
      <div className="auth-layout">
        <div className="auth-message"><ShieldCheck size={36} /><h1>Your case desk, secured.</h1><p>Sign in to keep saved cases, briefings, reviewer notes, and team settings connected to your workspace.</p><ul><li><LockKeyhole size={16} />Private workspace boundaries</li><li><KeyRound size={16} />Session protection and access controls</li><li><CheckCircle2 size={16} />Audit-ready review activity</li></ul></div>
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button></div>
          <h2>{mode === "login" ? "Welcome back" : "Create your review desk"}</h2><p>{mode === "login" ? "Continue to SignalProof." : "Start with a free Community workspace."}</p>
          {mode === "signup" ? <label>Full name<div><UserPlus size={16} /><input value={name} onChange={event => setName(event.target.value)} autoComplete="name" /></div></label> : null}
          <label>Email address<div><Mail size={16} /><input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></div></label>
          <label>Password<div><KeyRound size={16} /><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></div></label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button className="primary" type="submit">{mode === "login" ? "Sign in securely" : "Create free account"}<ArrowRight size={16} /></button>
          <small>This local build keeps account state in your browser. Connect a managed identity provider before handling production users.</small>
        </form>
      </div>
    </div>
  );
}
