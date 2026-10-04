"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface Series {
  name: string;
  /** CSS color, normally var(--series-N). */
  color: string;
  values: number[];
  dashed?: boolean;
}

interface Props {
  /** One label per point (e.g. years or ages). */
  x: number[];
  xLabel: string;
  series: Series[];
  formatY: (n: number) => string;
  /** Short description for screen readers. */
  summary: string;
  height?: number;
  /** Format for the x value in tooltips and the data table. */
  formatX?: (n: number) => string;
  logScale?: boolean;
  /** Hide the legend (e.g. when every line is the same kind of thing). */
  hideLegend?: boolean;
}

const PAD = { top: 16, right: 16, bottom: 36, left: 64 };

export function niceTicks(min: number, max: number, count = 4): number[] {
  if (max <= min) return [min];
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks = [];
  // Start at or below the minimum and end at or above the maximum, so every
  // point sits inside the axis.
  const top = Math.ceil(max / step) * step;
  for (let v = Math.floor(min / step) * step; v <= top + step * 1e-9; v += step) ticks.push(v);
  return ticks;
}

/**
 * Accessible SVG line chart: a legend, a crosshair tooltip on hover/focus,
 * and a data table for screen readers and print.
 */
export function LineChart({
  x,
  xLabel,
  series,
  formatY,
  summary,
  height = 280,
  formatX = String,
  logScale,
  hideLegend,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // Draw at the container's real width so text stays a readable size on phones.
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const tableId = useId();
  const H = W < 480 ? Math.round(height * 0.85) : height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const { yMin, yMax, ticks } = useMemo(() => {
    const all = series.flatMap((s) => s.values).filter(Number.isFinite);
    if (logScale) {
      const lo = Math.max(1e-6, Math.min(...all));
      const hi = Math.max(...all);
      const ticks: number[] = [];
      for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) ticks.push(10 ** e);
      return { yMin: Math.log10(ticks[0]), yMax: Math.log10(ticks[ticks.length - 1]), ticks };
    }
    const max = Math.max(0, ...all);
    const min = Math.min(0, ...all);
    const ticks = niceTicks(min, max);
    return { yMin: Math.min(min, ticks[0]), yMax: Math.max(max, ticks[ticks.length - 1]), ticks };
  }, [series, logScale]);

  const tx = (i: number) => PAD.left + (x.length <= 1 ? 0 : (i / (x.length - 1)) * innerW);
  const ty = (v: number) => {
    const val = logScale ? Math.log10(Math.max(v, 1e-6)) : v;
    return PAD.top + innerH - ((val - yMin) / (yMax - yMin || 1)) * innerH;
  };

  const xTickIdx = useMemo(() => {
    const n = Math.min(6, x.length);
    return Array.from(
      new Set(Array.from({ length: n }, (_, k) => Math.round((k * (x.length - 1)) / Math.max(1, n - 1)))),
    );
  }, [x.length]);

  const onMove = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.left) / innerW) * (x.length - 1));
    setHover(Math.max(0, Math.min(x.length - 1, i)));
  };

  return (
    <figure className="not-prose">
      {series.length > 1 && !hideLegend && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted" aria-hidden="true">
          {series.map((s) => (
            <li key={s.name} className="flex items-center gap-2">
              <svg width="20" height="8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="20"
                  y2="4"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeDasharray={s.dashed ? "5 3" : undefined}
                />
              </svg>
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <div className="relative" ref={boxRef}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y select-none"
          role="img"
          aria-label={summary}
          aria-describedby={tableId}
          tabIndex={0}
          onPointerMove={(e) => onMove(e.clientX)}
          onPointerDown={(e) => onMove(e.clientX)}
          onPointerLeave={() => setHover(null)}
          onBlur={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setHover((h) => Math.min(x.length - 1, (h ?? -1) + 1));
            if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? x.length) - 1));
            if (e.key === "Escape") setHover(null);
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={ty(t)} y2={ty(t)} stroke="var(--grid)" strokeWidth="1" />
              <text
                x={PAD.left - 8}
                y={ty(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="var(--muted)"
              >
                {formatY(t)}
              </text>
            </g>
          ))}
          {xTickIdx.map((i) => (
            <text key={i} x={tx(i)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">
              {formatX(x[i])}
            </text>
          ))}
          <text x={PAD.left + innerW / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="var(--muted)">
            {xLabel}
          </text>
          {series.map((s) => (
            <polyline
              key={s.name}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={s.dashed ? "6 4" : undefined}
              points={s.values.map((v, i) => `${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(" ")}
            />
          ))}
          {hover !== null && (
            <g>
              <line
                x1={tx(hover)}
                x2={tx(hover)}
                y1={PAD.top}
                y2={PAD.top + innerH}
                stroke="var(--muted)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {series.map((s) => (
                <circle
                  key={s.name}
                  cx={tx(hover)}
                  cy={ty(s.values[hover])}
                  r="4.5"
                  fill={s.color}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-md"
            style={
              tx(hover) > W / 2
                ? { right: `${((W - tx(hover)) / W) * 100 + 2}%` }
                : { left: `${(tx(hover) / W) * 100 + 2}%` }
            }
            aria-hidden="true"
          >
            <div className="font-medium">
              {xLabel} {formatX(x[hover])}
            </div>
            {series.map((s) => (
              <div key={s.name} className="flex items-center gap-2 tabular-nums">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-muted">{s.name}:</span> {formatY(s.values[hover])}
              </div>
            ))}
          </div>
        )}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-muted">Show the numbers as a table</summary>
        <div className="mt-2 max-h-72 overflow-auto">
          <table id={tableId} className="w-full text-left tabular-nums">
            <thead>
              <tr>
                <th className="border-b border-border py-1 pr-3">{xLabel}</th>
                {series.map((s) => (
                  <th key={s.name} className="border-b border-border py-1 pr-3">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {x.map((xv, i) => (
                <tr key={i}>
                  <td className="py-0.5 pr-3">{formatX(xv)}</td>
                  {series.map((s) => (
                    <td key={s.name} className="py-0.5 pr-3">
                      {formatY(s.values[i])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
