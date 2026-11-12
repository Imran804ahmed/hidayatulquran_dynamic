/** Server-rendered SVG charts with a data-table alternative (no client JS, no external library). */

export type Bucket = { key: string; label: string; reg: number; enq: number };

export function TrendChart({ buckets, title }: { buckets: Bucket[]; title: string }) {
  const n = Math.max(1, buckets.length);
  const max = Math.max(1, ...buckets.map((b) => Math.max(b.reg, b.enq)));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const w = 760, h = 240, padL = 34, padB = 28, padT = 10;
  const plotW = w - padL - 8, plotH = h - padB - padT;
  const slot = plotW / n;
  const barW = Math.max(2, Math.min(16, slot * 0.36));
  const labelEvery = Math.ceil(n / 10);
  return (
    <>
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title}>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padT + plotH - (plotH * i) / 4;
          return (
            <g key={i}>
              <line className="grid-line" x1={padL} x2={w - 8} y1={y} y2={y} />
              <text x={padL - 6} y={y + 4} textAnchor="end">{(niceMax * i) / 4}</text>
            </g>
          );
        })}
        {buckets.map((b, i) => {
          const x = padL + slot * i + slot / 2;
          const rh = (plotH * b.reg) / niceMax;
          const eh = (plotH * b.enq) / niceMax;
          return (
            <g key={b.key}>
              <rect className="bar-reg" x={x - barW - 1} y={padT + plotH - rh} width={barW} height={rh} rx={2}><title>{`${b.label}: ${b.reg} registrations`}</title></rect>
              <rect className="bar-enq" x={x + 1} y={padT + plotH - eh} width={barW} height={eh} rx={2}><title>{`${b.label}: ${b.enq} enquiries`}</title></rect>
              {i % labelEvery === 0 && <text x={x} y={h - 8} textAnchor="middle">{b.label}</text>}
            </g>
          );
        })}
      </svg>
      <details className="data-table">
        <summary>View as table</summary>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th scope="col">Period</th><th scope="col" className="num">Registrations</th><th scope="col" className="num">Enquiries</th></tr></thead>
            <tbody>{buckets.map((b) => <tr key={b.key}><td>{b.label}</td><td className="num">{b.reg}</td><td className="num">{b.enq}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </>
  );
}

/** Horizontal proportion bar row for reports. */
export function BarRow({ label, value, max, href }: { label: React.ReactNode; value: number; max: number; href?: string }) {
  const pct = max > 0 ? Math.round((100 * value) / max) : 0;
  return (
    <div className="bar-row">
      <span>{href ? <a href={href}>{label}</a> : label}</span>
      <span className="bar-track" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
      <strong className="num" style={{ textAlign: "right" }}>{value}</strong>
    </div>
  );
}
