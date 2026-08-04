/**
 * Prefixes cells that could be interpreted as a spreadsheet formula when
 * opened in Excel/Sheets (CSV injection — OWASP). Only user-authored free
 * text (merchant, note) can actually trigger this; applied to every cell
 * anyway as cheap defense in depth.
 */
export function sanitizeCsvCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/** Quotes a single CSV field per RFC 4180, escaping embedded quotes. */
export function csvField(value: string): string {
  const sanitized = sanitizeCsvCell(value);
  return /[",\n\r]/.test(sanitized)
    ? `"${sanitized.replace(/"/g, '""')}"`
    : sanitized;
}

export function csvRow(cells: string[]): string {
  return cells.map(csvField).join(",") + "\r\n";
}
