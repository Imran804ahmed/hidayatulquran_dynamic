import "server-only";

/** Neutralises spreadsheet formula injection: cells starting with = + - @ tab or CR get a leading quote. */
export function safeCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (s !== "" && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function csvResponse(filename: string, headers: string[], rows: unknown[][]): Response {
  const lines = [headers.map(safeCell).join(","), ...rows.map((r) => r.map(safeCell).join(","))];
  // BOM so Excel opens UTF-8 (Arabic/Urdu names) correctly.
  const body = "﻿" + lines.join("\r\n") + "\r\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename.replace(/[^A-Za-z0-9._-]/g, "_")}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
