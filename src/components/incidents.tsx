"use client";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Download, Search, X } from "lucide-react";
import { incidents } from "@/lib/data";
import { downloadText, toCsv } from "@/lib/download";
import { Panel, Status } from "./ui";

export function Incidents({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [source, setSource] = useState("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<(typeof incidents)[number] | null>(null);
  const filtered = useMemo(() => incidents.filter(item => {
    const matchesQuery = `${item.id} ${item.title} ${item.source} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesRisk = risk === "All" || (risk === "Critical" ? item.risk >= 85 : risk === "High" ? item.risk >= 70 && item.risk < 85 : item.risk < 70);
    return matchesQuery && matchesRisk && (source === "All" || item.source === source);
  }), [query, risk, source]);

  function toggleBookmark(id: string) {
    setBookmarks(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function exportRegister() {
    downloadText("scam-incidents.csv", toCsv(filtered.map(item => ({
      incident: item.id, title: item.title, source: item.source, category: item.category, risk: item.risk, status: item.status, updated: item.updated
    }))), "text/csv;charset=utf-8");
    notify(`Exported ${filtered.length} incidents as CSV.`);
  }
  return (
    <div className="view animate-fade-up">
      <div className="view-heading"><div><h1>Investigations</h1><p>Review, prioritize, and resolve submitted security incidents.</p></div><button className="ghost" onClick={exportRegister}><Download size={16} />Export register</button></div>
      <div className="filters">
        <label><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search incidents, senders, categories…" /></label>
        <select value={risk} onChange={event => setRisk(event.target.value)} aria-label="Filter risk"><option>All</option><option>Critical</option><option>High</option><option>Medium</option></select>
        <select value={source} onChange={event => setSource(event.target.value)} aria-label="Filter source"><option>All</option>{[...new Set(incidents.map(item => item.source))].map(item => <option key={item}>{item}</option>)}</select>
        <button className="ghost" onClick={() => { setQuery(""); setRisk("All"); setSource("All"); }}>Clear filters</button>
      </div>
      <Panel className="incident-register">
        <div className="register-header"><span>Showing {filtered.length} of {incidents.length} incidents</span><div><i />Live intelligence enabled</div></div>
        <div className="table-scroll"><table><thead><tr><th>Incident</th><th>Source</th><th>Category</th><th>Risk score</th><th>Status</th><th>Last updated</th><th /></tr></thead>
          <tbody>{filtered.map(item => <tr key={item.id} onClick={() => setSelected(item)}><td><strong>{item.id}</strong><small>{item.title}</small></td><td>{item.source}</td><td>{item.category}</td><td><div className="risk-cell"><b>{item.risk}</b><span><i style={{ width: `${item.risk}%` }} /></span></div></td><td><Status>{item.status}</Status></td><td>{item.updated}</td><td><button aria-label={`${bookmarks.has(item.id) ? "Remove bookmark from" : "Bookmark"} ${item.id}`} className={bookmarks.has(item.id) ? "bookmarked" : ""} onClick={event => { event.stopPropagation(); toggleBookmark(item.id); }}><>{bookmarks.has(item.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</></button></td></tr>)}</tbody>
        </table></div>
        {filtered.length === 0 ? <div className="empty-table">No incidents match these filters.</div> : null}
      </Panel>
      {selected ? <div className="detail-scrim" onClick={() => setSelected(null)}><aside className="incident-detail" onClick={event => event.stopPropagation()}><button className="detail-close" onClick={() => setSelected(null)}><X size={18} /></button><span className="detail-label">Incident investigation</span><h2>{selected.title}</h2><strong className="detail-id">{selected.id}</strong><div className="detail-score"><b>{selected.risk}</b><span>Risk score<br />{selected.risk >= 85 ? "Critical" : selected.risk >= 70 ? "High" : "Medium"} threat</span></div><dl><div><dt>Source</dt><dd>{selected.source}</dd></div><div><dt>Category</dt><dd>{selected.category}</dd></div><div><dt>Status</dt><dd><Status>{selected.status}</Status></dd></div><div><dt>Last updated</dt><dd>{selected.updated}</dd></div></dl><h3>Recommended next step</h3><p>Preserve the original message, verify the sender independently, and prevent interaction with any included link or attachment.</p><button className="primary" onClick={() => { toggleBookmark(selected.id); notify("Incident saved to bookmarks."); }}>Save investigation</button></aside></div> : null}
    </div>
  );
}
