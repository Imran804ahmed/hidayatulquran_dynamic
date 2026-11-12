import type { HistoryRow, AuditRow } from "@/lib/portal/audit";
import { fmtDateTime } from "@/lib/portal/time";
import { statusLabel } from "@/lib/portal/lookups";
import { NoteForm } from "./records";

/** Server components shared by record detail pages. */

export function NotesCard({ type, id, notes, canAdd, tz }: { type: string; id: number; notes: { id: number; body: string; created_at: string; user_name: string | null }[]; canAdd: boolean; tz: string }) {
  return (
    <section className="card" id="notes" aria-labelledby="notes-title">
      <div className="card-head"><h2 id="notes-title"><i className="bi bi-sticky" aria-hidden="true" /> Internal notes</h2><span className="private-tag"><i className="bi bi-lock-fill" aria-hidden="true" /> Private</span></div>
      <div className="card-body">
        {canAdd && <NoteForm type={type} id={id} />}
        {notes.length === 0 ? <p className="muted small mt-3">No notes yet.</p> : (
          <div className="mt-3">
            {notes.map((n) => (
              <div className="note" key={n.id}>
                <div className="note-head"><strong>{n.user_name ?? "Former user"}</strong> · {fmtDateTime(n.created_at, tz)}</div>
                <div className="pre-wrap">{n.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function HistoryCard({ history, audit, tz }: { history: HistoryRow[]; audit?: AuditRow[]; tz: string }) {
  type Item = { key: string; at: string; what: React.ReactNode; who: string | null };
  const items: Item[] = [
    ...history.map((h) => ({
      key: `h${h.id}`, at: h.created_at, who: h.user_name,
      what: <>Status {h.from_status ? <>changed from <strong>{statusLabel(h.from_status)}</strong> to </> : "set to "}<strong>{statusLabel(h.to_status)}</strong>{h.reason ? <> — <span className="muted">{h.reason}</span></> : null}</>,
    })),
    ...(audit ?? []).filter((a) => !/status|\.(active|inactive|archived)$/.test(a.action)).map((a) => ({ key: `a${a.id}`, at: a.created_at, who: a.user_name, what: <>{a.summary}</> })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <section className="card" aria-labelledby="hist-title">
      <div className="card-head"><h2 id="hist-title"><i className="bi bi-clock-history" aria-hidden="true" /> History</h2></div>
      <div className="card-body">
        {items.length === 0 ? <p className="muted small">No history recorded.</p> : (
          <ul className="timeline">
            {items.slice(0, 40).map((i) => (
              <li key={i.key}><span className="t-what">{i.what}</span><span className="t-when">{i.who ?? "Website / system"} · {fmtDateTime(i.at, tz)}</span></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
