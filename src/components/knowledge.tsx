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
      <div className="view-heading"><div><h1>Scam knowledge center</h1><p>Plain-language guidance for recognizing and preventing modern fraud.</p></div></div>
      <div className="knowledge-search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search phishing, deepfakes, delivery scams…" /></div>
      <div className="featured-guide"><div><BookOpen size={24} /><h2>Stop. Check. Protect.</h2><p>Three simple steps defeat most social engineering: pause the interaction, verify through a trusted channel, and secure any exposed account.</p><button className="light-button" onClick={() => setActive(["Safety playbook", "A practical response process for suspicious messages.", "Pause, verify independently, and protect exposed accounts."])}>Read the safety playbook <ArrowRight size={16} /></button></div><ShieldCheck size={112} strokeWidth={1} /></div>
      <div className="article-grid">{filtered.map((article, index) => <article key={article[0]}><span>{String(index + 1).padStart(2, "0")}</span><h2>{article[0]}</h2><p>{article[1]}</p><div><ShieldCheck size={15} /><small>{article[2]}</small></div><button onClick={() => setActive(article)}>Open guide <ArrowRight size={15} /></button></article>)}</div>
      {filtered.length === 0 ? <div className="empty-state">No guides match “{query}”. Try a broader term.</div> : null}
    </div>
  );
}

function Guide({ article, onBack }: { article: (typeof knowledgeArticles)[number]; onBack: () => void }) {
  return <div className="view guide-article animate-fade-up"><button className="back-button" onClick={onBack}><ArrowLeft size={17} />All guides</button><div className="guide-article-head"><BookOpen size={28} /><div><span>Awareness guide · 5 minute read</span><h1>{article[0]}</h1><p>{article[1]}</p></div></div><div className="guide-body"><main><h2>How the scam works</h2><p>Attackers create a believable reason for you to act quickly. They may impersonate a trusted person, organization, or service and direct you toward a link, payment, download, or disclosure of sensitive information.</p><h2>Signals to watch for</h2><ul><li>Unexpected urgency, fear, secrecy, or a reward that seems unusually generous.</li><li>A sender address, account, or destination that is slightly different from the real one.</li><li>Requests for passwords, security codes, remote access, gift cards, cryptocurrency, or changed bank details.</li><li>Pressure to avoid normal verification or approval processes.</li></ul><h2>What to do</h2><ol><li>Stop interacting with the message.</li><li>Open the organization’s official website yourself or call a verified number.</li><li>Preserve evidence and report the account or message.</li><li>If you already acted, secure affected accounts and contact the relevant provider immediately.</li></ol></main><aside><ShieldCheck size={22} /><h3>Best defense</h3><p>{article[2]}</p><div><CheckCircle2 size={16} />Verification through a separate channel breaks the attacker’s control of the conversation.</div></aside></div></div>;
}
