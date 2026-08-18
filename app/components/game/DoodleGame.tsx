"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameShell } from "@/app/components/game/GameShell";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import "./doodle.css";

const SWATCHES = ["#1e1e24", "#ff0055", "#00ffaa", "#8b5a2b", "#ff6aa9"] as const;

function pointerPos(e: { clientX: number; clientY: number; touches?: TouchList }, canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  const p = e.touches?.[0] ?? e;
  return {
    x: ((p.clientX - r.left) * canvas.width) / r.width,
    y: ((p.clientY - r.top) * canvas.height) / r.height,
  };
}

export function DoodleGame({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const href = (p: string) => localizeHref(p, locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const colorRef = useRef<string>(SWATCHES[0]);
  const acRef = useRef<AudioContext | null>(null);
  const twRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [color, setColor] = useState<string>(SWATCHES[0]);
  const [letter, setLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [boom, setBoom] = useState(false);

  colorRef.current = color;

  const audio = useCallback(() => {
    if (!acRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      acRef.current = new Ctor();
    }
    if (acRef.current.state === "suspended") void acRef.current.resume();
    return acRef.current;
  }, []);

  const scratch = useCallback(() => {
    const a = audio();
    const n = a.currentTime;
    const b = a.createBuffer(1, a.sampleRate * 0.02, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource();
    s.buffer = b;
    const f = a.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 400;
    const g = a.createGain();
    g.gain.setValueAtTime(0.02, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.02);
    s.connect(f);
    f.connect(g);
    g.connect(a.destination);
    s.start(n);
  }, [audio]);

  const pop = useCallback(() => {
    const a = audio();
    const n = a.currentTime;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(160, n);
    o.frequency.exponentialRampToValueAtTime(60, n + 0.12);
    g.gain.setValueAtTime(0.2, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.14);
    o.connect(g);
    g.connect(a.destination);
    o.start(n);
    o.stop(n + 0.15);
  }, [audio]);

  const tap = useCallback(() => {
    const a = audio();
    const n = a.currentTime;
    const b = a.createBuffer(1, a.sampleRate * 0.01, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource();
    s.buffer = b;
    const f = a.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 1500;
    const g = a.createGain();
    g.gain.setValueAtTime(0.03, n);
    s.connect(f);
    f.connect(g);
    g.connect(a.destination);
    s.start(n);
  }, [audio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;

    const onDown = (e: PointerEvent) => {
      drawing.current = true;
      canvas.setPointerCapture(e.pointerId);
      last.current = pointerPos(e, canvas);
      scratch();
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing.current) return;
      const p = pointerPos(e, canvas);
      ctx.strokeStyle = colorRef.current;
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last.current = p;
    };
    const onUp = () => {
      drawing.current = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [scratch]);

  useEffect(() => {
    return () => {
      if (twRef.current) clearInterval(twRef.current);
    };
  }, []);

  const wipe = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const send = () => {
    pop();
    setBoom(true);
    window.setTimeout(() => {
      setBoom(false);
      const notes = [m.game.doodle.letter1, m.game.doodle.letter2];
      const text = notes[Math.floor(Math.random() * notes.length)];
      setLetter("");
      setShowLetter(true);
      let i = 0;
      if (twRef.current) clearInterval(twRef.current);
      twRef.current = setInterval(() => {
        i += 1;
        setLetter(text.slice(0, i));
        tap();
        if (i >= text.length && twRef.current) {
          clearInterval(twRef.current);
          twRef.current = null;
        }
      }, 40);
    }, 280);
  };

  const closeLetter = () => {
    if (twRef.current) clearInterval(twRef.current);
    twRef.current = null;
    setShowLetter(false);
  };

  return (
    <GameShell locale={locale} kicker={m.game.doodle.kicker} title={m.game.doodle.title} lead={m.game.doodle.lead}>
      <div className={`nz${boom ? " boom" : ""}`}>
        <div className="nz-glitch" aria-hidden />
        <div className="nz-board">
          <canvas ref={canvasRef} className="nz-canvas" width={400} height={350} />
          <div className="nz-tools">
            <div className="nz-swatches">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`nz-sw${color === c ? " on" : ""}`}
                  style={{ background: c }}
                  aria-label={c}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <button type="button" className="nz-ghost" onClick={wipe}>
              {m.game.doodle.wipe}
            </button>
          </div>
        </div>
        <button type="button" className="nz-fire" onClick={send}>
          {m.game.doodle.send}
        </button>
        <div className={`nz-letter${showLetter ? " show" : ""}`} role="dialog" aria-modal={showLetter}>
          <div className="nz-body">{letter}</div>
          <button type="button" className="nz-ghost" style={{ marginTop: 16 }} onClick={closeLetter}>
            {m.game.doodle.back}
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={href("/game/post")} className="btn btn-ghost">
          {m.game.cardPost}
        </Link>
        <Link href={href("/game")} className="btn btn-ghost">
          {m.game.hubBack}
        </Link>
      </div>
    </GameShell>
  );
}
