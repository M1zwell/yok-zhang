/**
 * Client-only text layout. `prepare()` uses canvas — never call during SSR.
 * Wraps @chenglou/pretext; falls back to Offscreen/canvas measureText if needed.
 */
import {
  layoutWithLines as pretextLayoutWithLines,
  prepareWithSegments as pretextPrepareWithSegments,
  setLocale as pretextSetLocale,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

export type PretextLine = {
  text: string;
  width: number;
};

export type PretextLayout = {
  lines: PretextLine[];
  height: number;
  lineCount: number;
};

type FallbackPrepared = {
  fallback: true;
  text: string;
  font: string;
  segments: { text: string; width: number; break: boolean }[];
};

export type PreparedHandle = PreparedTextWithSegments | FallbackPrepared;

function isFallback(handle: PreparedHandle): handle is FallbackPrepared {
  return typeof handle === "object" && handle !== null && "fallback" in handle && handle.fallback === true;
}

function measureWidth(text: string, font: string): number {
  try {
    const canvas =
      typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(1, 1) : document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return text.length * 8;
    ctx.font = font;
    return ctx.measureText(text).width;
  } catch {
    return text.length * 8;
  }
}

function fallbackPrepare(text: string, font: string): FallbackPrepared {
  const normalized = text.replace(/\s+/g, " ").trim();
  const segments: FallbackPrepared["segments"] = [];
  const grapheme = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const word = new Intl.Segmenter(undefined, { granularity: "word" });
  for (const w of word.segment(normalized)) {
    const piece = w.segment;
    const cjk = /[\u3000-\u9fff\uac00-\ud7af\u0e00-\u0e7f]/.test(piece);
    if (cjk) {
      for (const g of grapheme.segment(piece)) {
        segments.push({ text: g.segment, width: measureWidth(g.segment, font), break: true });
      }
    } else if (w.isWordLike) {
      segments.push({ text: piece, width: measureWidth(piece, font), break: true });
    } else {
      segments.push({ text: piece, width: measureWidth(piece, font), break: /^\s+$/.test(piece) });
    }
  }
  return { fallback: true, text: normalized, font, segments };
}

function fallbackLayout(handle: FallbackPrepared, maxWidth: number, lineHeight: number): PretextLayout {
  const lines: PretextLine[] = [];
  let current = "";
  let width = 0;
  const flush = () => {
    if (!current && lines.length === 0) return;
    lines.push({ text: current.replace(/\s+$/, ""), width });
    current = "";
    width = 0;
  };
  for (const seg of handle.segments) {
    const next = width + seg.width;
    if (seg.break && width > 0 && next > maxWidth) {
      flush();
      if (/^\s+$/.test(seg.text)) continue;
    }
    current += seg.text;
    width += seg.width;
  }
  if (current || lines.length === 0) flush();
  const lineCount = Math.max(lines.length, 1);
  return { lines, lineCount, height: lineCount * lineHeight };
}

export function prepareLines(text: string, font: string, locale?: string): PreparedHandle {
  if (typeof document === "undefined") {
    return fallbackPrepare(text, font);
  }
  try {
    if (locale) pretextSetLocale(locale);
    return pretextPrepareWithSegments(text, font);
  } catch {
    return fallbackPrepare(text, font);
  }
}

export function layoutPrepared(handle: PreparedHandle, maxWidth: number, lineHeight: number): PretextLayout {
  const width = Math.max(8, maxWidth);
  if (isFallback(handle)) return fallbackLayout(handle, width, lineHeight);
  try {
    const result = pretextLayoutWithLines(handle, width, lineHeight);
    return {
      lines: result.lines.map((line) => ({ text: line.text, width: line.width })),
      height: result.height,
      lineCount: result.lineCount,
    };
  } catch {
    return fallbackLayout(fallbackPrepare("", "16px sans-serif"), width, lineHeight);
  }
}

export { pretextSetLocale as setPretextLocale };
