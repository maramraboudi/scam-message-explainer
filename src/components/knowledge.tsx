"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { knowledgeArticles } from "@/lib/data";

export function Knowledge() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<(typeof knowledgeArticles)[number] | null>(null);
  const filtered = useMemo(() => knowledgeArticles.filter(article => article.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  if (active) return <Guide article={active} onBack={() => setActive(null)} />;
  return (
    <div className="view animate-fade-up">
      <div className="view-heading"><div><h1>Field notes</h1><p>Short reviewer playbooks for the message patterns teams actually see.</p></div></div>
      <div className="knowledge-search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search lookalikes, voice pressure, payment diversion..." /></div>
      <div className="featured-guide"><div><BookOpen size={24} /><h2>Pause the path, not the person.</h2><p>The SignalProof review method separates the message route from the claimed sender: verify the route, then decide whether the request deserves trust.</p><button className="light-button" onClick={() => setActive(["Reviewer method", "A practical response process for suspicious messages.", "Pause the message path, verify independently, and protect any exposed account."])}>Read the reviewer method <ArrowRight size={16} /></button></div><ShieldCheck size={112} strokeWidth={1} /></div>
      <div className="article-grid">{filtered.map((article, index) => <article key={article[0]}><span>{String(index + 1).padStart(2, "0")}</span><h2>{article[0]}</h2><p>{article[1]}</p><div><ShieldCheck size={15} /><small>{article[2]}</small></div><button onClick={() => setActive(article)}>Open note <ArrowRight size={15} /></button></article>)}</div>
      {filtered.length === 0 ? <div className="empty-state">No field notes match this search. Try a broader term.</div> : null}
    </div>
  );
}

function Guide({ article, onBack }: { article: (typeof knowledgeArticles)[number]; onBack: () => void }) {
  return <div className="view guide-article animate-fade-up"><button className="back-button" onClick={onBack}><ArrowLeft size={17} />All field notes</button><div className="guide-article-head"><BookOpen size={28} /><div><span>SignalProof field note - 5 minute read</span><h1>{article[0]}</h1><p>{article[1]}</p></div></div><div className="guide-body"><main><h2>How the pattern works</h2><p>Attackers borrow trust from a familiar brand, person, or workflow, then push the reviewer toward a link, payment, file, or secret before normal checks can happen.</p><h2>Signals to watch for</h2><ul><li>Unexpected urgency, fear, secrecy, or an unusually generous reward.</li><li>A sender address, handle, or domain that is close to the real one but not exact.</li><li>Requests for passwords, security codes, remote access, gift cards, crypto, or changed bank details.</li><li>Pressure to avoid the usual approval or verification route.</li></ul><h2>What to do</h2><ol><li>Stop interacting with the message path.</li><li>Open the official service yourself or call a number you already trust.</li><li>Preserve evidence and record the sender, destination, and timestamp.</li><li>If anyone already acted, secure affected accounts and notify the relevant provider.</li></ol></main><aside><ShieldCheck size={22} /><h3>Best defense</h3><p>{article[2]}</p><div><CheckCircle2 size={16} />Verification through a separate channel breaks attacker control of the conversation.</div></aside></div></div>;
}
