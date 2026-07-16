"use client";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Download, Filter, Search, X } from "lucide-react";
import { incidents } from "@/lib/data";
import { downloadText, toCsv } from "@/lib/download";
import { Panel, Status } from "./ui";

export function Incidents({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [source, setSource] = useState("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selected, setSelected] = useState<(typeof incidents)[number] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sme-bookmarks-v1");
    if (!saved) {
      setBookmarksLoaded(true);
      return;
    }
    try {
      setBookmarks(new Set(JSON.parse(saved) as string[]));
    } catch {
      localStorage.removeItem("sme-bookmarks-v1");
    } finally {
      setBookmarksLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!bookmarksLoaded) return;
    localStorage.setItem("sme-bookmarks-v1", JSON.stringify([...bookmarks]));
  }, [bookmarks, bookmarksLoaded]);

  const filtered = useMemo(() => incidents.filter(item => {
    const matchesQuery = `${item.id} ${item.title} ${item.sender} ${item.owner} ${item.source} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesRisk = risk === "All" || (risk === "Critical" ? item.risk >= 85 : risk === "High" ? item.risk >= 70 && item.risk < 85 : item.risk < 70);
    const matchesBookmark = !bookmarkedOnly || bookmarks.has(item.id);
    return matchesQuery && matchesRisk && matchesBookmark && (source === "All" || item.source === source);
  }), [bookmarkedOnly, bookmarks, query, risk, source]);

  function toggleBookmark(id: string) {
    setBookmarks(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function exportRegister() {
    downloadText("signalproof-case-queue.csv", toCsv(filtered.map(item => ({
      case: item.id, title: item.title, sender: item.sender, owner: item.owner, source: item.source, category: item.category, risk: item.risk, status: item.status, updated: item.updated
    }))), "text/csv;charset=utf-8");
    notify(`Exported ${filtered.length} cases as CSV.`);
  }
  return (
    <div className="view animate-fade-up">
      <div className="view-heading"><div><h1>Case queue</h1><p>Prioritize live messages by sender, owner, risk, and the next verification step.</p></div><button className="ghost" onClick={exportRegister}><Download size={16} />Export queue</button></div>
      <div className="filters">
        <label><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search cases, senders, owners..." /></label>
        <select value={risk} onChange={event => setRisk(event.target.value)} aria-label="Filter risk"><option>All</option><option>Critical</option><option>High</option><option>Medium</option></select>
        <select value={source} onChange={event => setSource(event.target.value)} aria-label="Filter source"><option>All</option>{[...new Set(incidents.map(item => item.source))].map(item => <option key={item}>{item}</option>)}</select>
        <button className={`ghost ${bookmarkedOnly ? "active-filter" : ""}`} onClick={() => setBookmarkedOnly(value => !value)}><BookmarkCheck size={15} />Saved only</button>
        <button className="ghost" onClick={() => { setQuery(""); setRisk("All"); setSource("All"); setBookmarkedOnly(false); }}><Filter size={15} />Clear filters</button>
      </div>
      <Panel className="incident-register">
        <div className="register-header"><span>Showing {filtered.length} of {incidents.length} cases</span><div><i />Live queue active</div></div>
        <div className="table-scroll"><table><thead><tr><th>Case</th><th>Sender</th><th>Owner</th><th>Category</th><th>Risk score</th><th>Status</th><th>Last updated</th><th /></tr></thead>
          <tbody>{filtered.map(item => <tr key={item.id} onClick={() => setSelected(item)}><td><strong>{item.id}</strong><small>{item.title}</small></td><td>{item.sender}<small>{item.source}</small></td><td>{item.owner}</td><td>{item.category}</td><td><div className="risk-cell"><b>{item.risk}</b><span><i style={{ width: `${item.risk}%` }} /></span></div></td><td><Status>{item.status}</Status></td><td>{item.updated}</td><td><button aria-label={`${bookmarks.has(item.id) ? "Remove bookmark from" : "Bookmark"} ${item.id}`} className={bookmarks.has(item.id) ? "bookmarked" : ""} onClick={event => { event.stopPropagation(); toggleBookmark(item.id); }}><>{bookmarks.has(item.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</></button></td></tr>)}</tbody>
        </table></div>
        {filtered.length === 0 ? <div className="empty-table">No cases match these filters.</div> : null}
      </Panel>
      {selected ? <div className="detail-scrim" onClick={() => setSelected(null)}><aside className="incident-detail" onClick={event => event.stopPropagation()}><button className="detail-close" aria-label="Close case details" onClick={() => setSelected(null)}><X size={18} /></button><span className="detail-label">SignalProof case</span><h2>{selected.title}</h2><strong className="detail-id">{selected.id}</strong><div className="detail-score"><b>{selected.risk}</b><span>Risk score<br />{selected.risk >= 85 ? "Critical" : selected.risk >= 70 ? "High" : "Medium"} signal</span></div><dl><div><dt>Sender</dt><dd>{selected.sender}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Category</dt><dd>{selected.category}</dd></div><div><dt>Status</dt><dd><Status>{selected.status}</Status></dd></div><div><dt>Last updated</dt><dd>{selected.updated}</dd></div></dl><h3>Recommended next step</h3><p>{selected.nextStep}</p><button className={bookmarks.has(selected.id) ? "ghost" : "primary"} onClick={() => { if (!bookmarks.has(selected.id)) { toggleBookmark(selected.id); notify("Case saved to bookmarks."); } }}>{bookmarks.has(selected.id) ? "Saved to bookmarks" : "Save case"}</button></aside></div> : null}
    </div>
  );
}
