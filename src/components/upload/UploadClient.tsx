"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type DragEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { parseCsv } from "@/data/csv/parser";
import { buildColumnToMetricKeyMap } from "@/data/registry/metrics";

interface Preview {
  fileName: string;
  rawText: string;
  rowCount: number;
  recognizedColumns: string[];
  unknownColumns: string[];
  matchedCount: number;
  unmatchedCount: number;
}

interface UploadResult {
  matchedCount: number;
  unmatchedTrackerIds: number[];
}

/**
 * Parses client-side for an instant preview (the parser and column map
 * are plain functions with no Node dependencies, so they run fine in the
 * browser), then POSTs the raw text to /api/upload so the same merge
 * lands in the shared server-side data source every page reads from.
 */
export function UploadClient({ knownTrackerIds }: { knownTrackerIds: number[] }) {
  const router = useRouter();
  const knownIds = new Set(knownTrackerIds);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File) {
    setError(null);
    setResult(null);
    setPreview(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a .csv file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { headers, rows } = parseCsv(text);

      if (headers.length === 0 || rows.length === 0) {
        setError("That file doesn't look like a valid CSV — no rows were found.");
        return;
      }

      const columnToMetric = buildColumnToMetricKeyMap();
      const recognizedColumns: string[] = [];
      const unknownColumns: string[] = [];

      for (const header of headers) {
        if (header === "tracker_id" || header === "team") continue;
        (columnToMetric.has(header) ? recognizedColumns : unknownColumns).push(header);
      }

      let matchedCount = 0;
      let unmatchedCount = 0;
      for (const row of rows) {
        const trackerId = Number(row.tracker_id);
        if (!Number.isFinite(trackerId)) continue;
        if (knownIds.has(trackerId)) matchedCount++;
        else unmatchedCount++;
      }

      setPreview({
        fileName: file.name,
        rawText: text,
        rowCount: rows.length,
        recognizedColumns,
        unknownColumns,
        matchedCount,
        unmatchedCount,
      });
    };

    reader.onerror = () => setError("Couldn't read that file — please try again.");
    reader.readAsText(file);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleConfirm() {
    if (!preview) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: preview.rawText,
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.error ?? "Upload failed — please try again.");
      }

      setResult(body as UploadResult);
      setPreview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-accent bg-accent/5" : "border-border bg-surface"
        }`}
      >
        <p className="text-sm text-muted-foreground">Drag a .csv file here, or</p>
        <label>
          <span className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:opacity-90">
            Choose File
          </span>
          <input type="file" accept=".csv" className="hidden" onChange={onInputChange} />
        </label>
      </div>

      {error && (
        <Card className="border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="flex flex-col gap-1 border-accent/40 bg-accent/5">
          <p className="text-sm font-medium text-foreground">
            Updated {result.matchedCount} player{result.matchedCount === 1 ? "" : "s"} with real data.
          </p>
          {result.unmatchedTrackerIds.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {result.unmatchedTrackerIds.length} row(s) had a tracker_id we don&apos;t recognize and were
              skipped: {result.unmatchedTrackerIds.join(", ")}
            </p>
          )}
        </Card>
      )}

      {preview && (
        <Card className="flex flex-col gap-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview · {preview.fileName}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatTile label="Rows" value={String(preview.rowCount)} />
            <StatTile label="Matched" value={String(preview.matchedCount)} />
            <StatTile label="Unmatched" value={String(preview.unmatchedCount)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium text-muted-foreground">Recognized columns</div>
            <div className="flex flex-wrap gap-1.5">
              {preview.recognizedColumns.length > 0 ? (
                preview.recognizedColumns.map((column) => (
                  <span key={column} className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                    {column}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">None</span>
              )}
            </div>
          </div>

          {preview.unknownColumns.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground">Unrecognized columns (ignored)</div>
              <div className="flex flex-wrap gap-1.5">
                {preview.unknownColumns.map((column) => (
                  <span
                    key={column}
                    className="rounded-full bg-surface-2 px-2 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleConfirm} disabled={isSubmitting || preview.matchedCount === 0}>
            {isSubmitting ? "Merging…" : "Confirm & Merge"}
          </Button>
          {preview.matchedCount === 0 && (
            <p className="text-xs text-muted-foreground">
              No rows matched a known player, so there&apos;s nothing to merge.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
