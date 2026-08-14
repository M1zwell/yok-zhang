"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { layoutPrepared, prepareLines, type PretextLine } from "@/lib/pretext";

type Tag = "p" | "h1" | "h2" | "h3" | "div" | "span";

export function PretextLines({
  text,
  className,
  as = "p",
  reveal = true,
  tight = false,
  locale,
}: {
  text: string;
  className?: string;
  as?: Tag;
  reveal?: boolean;
  tight?: boolean;
  locale?: string;
}) {
  const Tag = as as ElementType;
  const boxRef = useRef<HTMLElement | null>(null);
  const [lines, setLines] = useState<PretextLine[] | null>(null);
  const [height, setHeight] = useState<number>();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const style = getComputedStyle(el);
    const font = style.font || `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const parsed = Number.parseFloat(style.lineHeight);
    const lineHeight = Number.isFinite(parsed) ? parsed : Number.parseFloat(style.fontSize) * 1.45;
    let handle: ReturnType<typeof prepareLines> | null = null;
    try {
      handle = prepareLines(text, font, locale);
    } catch {
      handle = null;
    }

    const relayout = () => {
      if (!handle) {
        setLines(null);
        setHeight(undefined);
        return;
      }
      const width = el.clientWidth;
      if (width < 12) {
        setLines(null);
        return;
      }
      const result = layoutPrepared(handle, width, lineHeight);
      setLines(result.lines);
      setHeight(result.height);
    };

    relayout();
    const observer = new ResizeObserver(relayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, locale]);

  const style: CSSProperties | undefined = height ? { minHeight: height } : undefined;

  return (
    <Tag
      ref={boxRef}
      className={`pretext-block${tight ? " pretext-tight" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {lines && lines.length > 0
        ? lines.map((line, index) => (
            <span
              key={`${index}:${line.text}`}
              className={reveal && !reduce ? "pretext-line" : "pretext-line is-in"}
              style={reveal && !reduce ? { animationDelay: `${index * 70}ms` } : undefined}
            >
              {line.text || "\u00a0"}
            </span>
          ))
        : text}
    </Tag>
  );
}
