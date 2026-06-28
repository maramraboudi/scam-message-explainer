export function downloadText(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function toCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  const encode = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  return [columns.map(encode).join(","), ...rows.map(row => columns.map(column => encode(row[column])).join(","))].join("\n");
}
