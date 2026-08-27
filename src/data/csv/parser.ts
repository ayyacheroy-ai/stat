/**
 * Minimal, dependency-free CSV parser. Handles the simple comma-separated,
 * optionally-quoted format the tracker exports — not a general-purpose CSV
 * library. If the tracker's export format grows more complex, swap this
 * for a real CSV library without touching anything outside data/csv/.
 */
export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsv(input: string): CsvParseResult {
  const lines = input.trim().split(/\r?\n/).filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });

  return { headers, rows };
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}
