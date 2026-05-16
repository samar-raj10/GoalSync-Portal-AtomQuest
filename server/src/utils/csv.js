function escapeCsv(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map(row => headers.map(header => escapeCsv(row[header])).join(','))].join('\n');
}

module.exports = { toCsv };
