"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { isCrisisAsk } from "@/lib/game/crisis";
import { randomQuestion } from "@/lib/game/questions";
import { localizeHref, type Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import "./post-office.css";

type Limiter = "draw" | "haiku" | "friend";
type Reply = { type: "draw"; image: string; text: string } | { type: "text"; text: string };

const LIMITERS: Limiter[] = ["draw", "haiku", "friend"];

function countCjk(s: string): number {
  return [...s.replace(/\s/g, "")].length;
}

function popSound() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(180, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(70, ac.currentTime + 0.12);
    g.gain.setValueAtTime(0.22, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.16);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.17);
  } catch {
    /* cork is visual if audio is locked */
  }
}

export function PostOfficeGame({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const p = m.game.post;
  const href = (path: string) => localizeHref(path, locale);

  const [question, setQuestion] = useState("");
  const [current, setCurrent] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [mode, setMode] = useState<Limiter | "">("");
  const [delay, setDelay] = useState(8000);
  const [statusA, setStatusA] = useState(p.statusAIdle);
  const [statusB, setStatusB] = useState(p.statusBIdle);
  const [exclaim, setExclaim] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [letter, setLetter] = useState(false);
  const [letterBody, setLetterBody] = useState("");
  const [letterImage, setLetterImage] = useState("");
  const [letterMeta, setLetterMeta] = useState("");
  const [beam, setBeam] = useState(false);
  const [toast, setToast] = useState("");
  const [help, setHelp] = useState(false);
  const [clock, setClock] = useState(p.clock);
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [h3, setH3] = useState("");
  const [friend, setFriend] = useState("");
  const [flying, setFlying] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const charARef = useRef<HTMLDivElement>(null);
  const charBRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const doodleRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPt = useRef({ x: 0, y: 0 });
  const ink = useRef("#29242a");
  const undoStack = useRef<ImageData[]>([]);
  const replyRef = useRef<Reply | null>(null);
  const toastTimer = useRef<number>(0);
  const typeTimer = useRef<number>(0);
  const deliveryTimer = useRef<number>(0);
  const playRef = useRef<HTMLElement | null>(null);

  const showToast = useCallback((text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1800);
  }, []);

  useEffect(() => {
    const tick = () => {
      setClock(`${new Date().toLocaleTimeString(locale.startsWith("zh") ? "zh-CN" : locale, { hour12: false })} / ${p.clock}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [locale, p.clock]);

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimer.current);
      window.clearInterval(typeTimer.current);
      window.clearInterval(deliveryTimer.current);
    };
  }, []);

  const sizeCanvas = useCallback(() => {
    const canvas = doodleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const r = canvas.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = r.width * d;
    canvas.height = r.height * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx, w: r.width, h: r.height };
  }, []);

  const prepareCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      const sized = sizeCanvas();
      if (!sized) return;
      const { ctx, w, h } = sized;
      ctx.fillStyle = "#eadfca";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#766b5c";
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillText(p.canvasHint, 14, 22);
      undoStack.current = [];
    });
  }, [p.canvasHint, sizeCanvas]);

  const snapshot = useCallback(() => {
    const canvas = doodleRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (undoStack.current.length > 24) undoStack.current.shift();
    } catch {
      /* ignore tainted snapshot */
    }
  }, []);

  const fillQuestion = useCallback(() => {
    setQuestion(randomQuestion(locale));
    setHelp(false);
  }, [locale]);

  const scrollPlay = useCallback(() => {
    playRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const postQuestion = useCallback(() => {
    const q = question.trim();
    if (!q) {
      showToast(p.toastEmpty);
      return;
    }
    if (isCrisisAsk(q)) {
      setHelp(true);
      setCurrent("");
      setClaimed(false);
      setExclaim(false);
      setLetter(false);
      setBeam(false);
      setChallenge(false);
      return;
    }
    setHelp(false);
    setCurrent(q);
    setClaimed(false);
    replyRef.current = null;
    setExclaim(true);
    setStatusA(p.statusAPosted);
    setStatusB(p.statusBPing);
    setBeam(false);
    setLetter(false);
    setChallenge(false);
    setDelivery(false);
    setFlying(false);
    showToast(p.toastPosted);
  }, [p, question, showToast]);

  const claimJob = useCallback(() => {
    if (!current) {
      showToast(p.toastNoJob);
      return;
    }
    if (claimed) {
      showToast(p.toastClaimed);
      return;
    }
    const next = LIMITERS[Math.floor(Math.random() * LIMITERS.length)] ?? "friend";
    setClaimed(true);
    setExclaim(false);
    setMode(next);
    setChallenge(true);
    setStatusB(p.statusBClaim);
  }, [claimed, current, p, showToast]);

  useEffect(() => {
    if (challenge && mode === "draw") prepareCanvas();
  }, [challenge, mode, prepareCanvas]);

  const cancelReply = useCallback(() => {
    setChallenge(false);
    setClaimed(false);
    setStatusB(p.statusBCancel);
    setExclaim(true);
  }, [p.statusBCancel]);

  const typewrite = useCallback((text: string) => {
    window.clearInterval(typeTimer.current);
    setLetterBody("");
    let i = 0;
    typeTimer.current = window.setInterval(() => {
      i += 1;
      setLetterBody(text.slice(0, i));
      if (i >= text.length) window.clearInterval(typeTimer.current);
    }, 38);
  }, []);

  const deliver = useCallback((reply: Reply, limiter: Limiter) => {
    popSound();
    setDelivery(false);
    setFlying(false);
    setStatusA(p.statusAPop);
    setLetterMeta(`${p.letterFrom}${limiter.toUpperCase()}`);
    if (reply.type === "draw") {
      setLetterImage(reply.image);
      typewrite(reply.text);
    } else {
      setLetterImage("");
      typewrite(reply.text);
    }
    setLetter(true);
  }, [p.letterFrom, p.statusAPop, typewrite]);

  const sendBottle = useCallback(
    (ms: number, reply: Reply, limiter: Limiter) => {
      window.clearInterval(deliveryTimer.current);
      setDelivery(true);
      setFlying(false);
      requestAnimationFrame(() => {
        const bottle = stageRef.current?.querySelector(".po-bottle3d") as HTMLElement | null;
        if (bottle) bottle.style.setProperty("--delivery", `${ms}ms`);
        setFlying(true);
      });
      setProgress(0);
      setStatusA(p.statusATransit);
      const start = Date.now();
      deliveryTimer.current = window.setInterval(() => {
        const ratio = Math.min(1, (Date.now() - start) / ms);
        setProgress(ratio * 100);
        setCountdown(`${Math.ceil((1 - ratio) * ms / 1000)}s`);
        const stage = stageRef.current;
        if (stage && Math.random() > 0.35) {
          const spark = document.createElement("i");
          spark.className = "po-spark";
          spark.style.left = `${45 + Math.random() * 42}%`;
          spark.style.top = `${18 + Math.random() * 52}%`;
          stage.appendChild(spark);
          window.setTimeout(() => spark.remove(), 700);
        }
        if (ratio >= 1) {
          window.clearInterval(deliveryTimer.current);
          deliver(reply, limiter);
        }
      }, 120);
    },
    [deliver, p.statusATransit],
  );

  const sendReply = useCallback(() => {
    if (!mode) return;
    let reply: Reply | null = null;
    if (mode === "draw") {
      const canvas = doodleRef.current;
      if (!canvas) return;
      reply = { type: "draw", image: canvas.toDataURL("image/png"), text: p.doodleCaption };
    } else if (mode === "haiku") {
      if (countCjk(h1) !== 5 || countCjk(h2) !== 7 || countCjk(h3) !== 5) {
        showToast(p.toastHaiku);
        return;
      }
      reply = { type: "text", text: `${h1.trim()}\n${h2.trim()}\n${h3.trim()}` };
    } else {
      const text = friend.trim();
      if (!text) {
        showToast(p.toastFriend);
        return;
      }
      reply = { type: "text", text };
    }
    replyRef.current = reply;
    setChallenge(false);
    setStatusB(p.statusBSent);
    sendBottle(delay, reply, mode);
  }, [delay, friend, h1, h2, h3, mode, p, sendBottle, showToast]);

  const rateReply = useCallback(
    (kind: "warm" | "silly") => {
      setLetter(false);
      setBeam(true);
      setStatusA(kind === "warm" ? p.statusAWarm : p.statusASilly);
      setStatusB(kind === "warm" ? p.statusBWarm : p.statusBSilly);
      showToast(kind === "warm" ? p.toastWarm : p.toastSilly);
    },
    [p, showToast],
  );

  useLayoutEffect(() => {
    if (!beam) return;
    const place = () => {
      const a = charBRef.current?.getBoundingClientRect();
      const b = charARef.current?.getBoundingClientRect();
      const s = stageRef.current?.getBoundingClientRect();
      const el = beamRef.current;
      if (!a || !b || !s || !el) return;
      const x1 = a.left + a.width / 2 - s.left;
      const y1 = a.top + a.height / 2 - s.top;
      const x2 = b.left + b.width / 2 - s.left;
      const y2 = b.top + b.height / 2 - s.top;
      const dx = x2 - x1;
      const dy = y2 - y1;
      el.style.left = `${x1}px`;
      el.style.top = `${y1}px`;
      el.style.width = `${Math.hypot(dx, dy)}px`;
      el.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [beam]);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = doodleRef.current;
    if (!canvas) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const r = canvas.getBoundingClientRect();
    lastPt.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    snapshot();
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = doodleRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ctx.strokeStyle = ink.current;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPt.current = { x, y };
  };
  const onPointerUp = () => {
    drawing.current = false;
  };

  const undo = () => {
    const canvas = doodleRef.current;
    const ctx = canvas?.getContext("2d");
    const snap = undoStack.current.pop();
    if (!canvas || !ctx || !snap) {
      prepareCanvas();
      return;
    }
    ctx.putImageData(snap, 0, 0);
  };

  const challengeTitle =
    mode === "draw" ? p.limiterDrawTitle : mode === "haiku" ? p.limiterHaikuTitle : p.limiterFriendTitle;
  const limiterTag =
    mode === "draw" ? p.limiterDrawTag : mode === "haiku" ? p.limiterHaikuTag : p.limiterFriendTag;

  return (
    <main>
      <div className="page-x mx-auto max-w-6xl pt-6">
        <Link href={href("/game")} className="text-sm text-muted transition-colors hover:text-accent">
          {m.game.hubBack}
        </Link>
      </div>
      <div className="po">
        <div className="po-app">
          <div className="po-top">
            <div className="po-brand">
              <span className="po-dot" />
              <span>{p.brand}</span>
            </div>
            <div>{clock}</div>
          </div>

          <div className="po-hero">
            <div>
              <div className="po-kicker">{p.kicker}</div>
              <h1>
                {p.title}
                <small>{p.titleEn}</small>
              </h1>
              <p className="po-lead">{p.lead}</p>
              <p className="po-desc">{p.desc}</p>
              <div className="po-btnrow">
                <button type="button" className="po-btn pink" onClick={scrollPlay}>
                  {p.enter}
                </button>
                <button
                  type="button"
                  className="po-btn ghost"
                  onClick={() => {
                    fillQuestion();
                    scrollPlay();
                  }}
                >
                  {p.randomQ}
                </button>
              </div>
            </div>
            <div className="po-poster">
              <div className="po-neon">{p.neon}</div>
              <div className="po-city" />
              <div className="po-windows" />
              <div className="po-pigbox" />
              <div className="po-bottle-mini" />
            </div>
          </div>

          <section>
            <div className="po-kicker">{p.rule}</div>
            <h2>{p.stepsTitle}</h2>
            <div className="po-flow">
              <div className="po-card">
                <div className="po-n">{p.step1n}</div>
                <b>{p.step1t}</b>
                <p>{p.step1p}</p>
              </div>
              <div className="po-card">
                <div className="po-n">{p.step2n}</div>
                <b>{p.step2t}</b>
                <p>{p.step2p}</p>
              </div>
              <div className="po-card">
                <div className="po-n">{p.step3n}</div>
                <b>{p.step3t}</b>
                <p>{p.step3p}</p>
              </div>
            </div>
          </section>

          <section ref={playRef} id="play">
            <div className="po-kicker">{p.playKicker}</div>
            <h2>{p.playTitle}</h2>
            <p className="po-intro">{p.playIntro}</p>

            <div className="po-game">
              <div className="po-panel">
                <h3>{p.playerA}</h3>
                <div className="po-player">
                  <div className="po-avatar">🐷</div>
                  <div>
                    <b>{p.juju}</b>
                    <span className="po-badge">{p.localA}</span>
                    <div className="po-status">{statusA}</div>
                  </div>
                </div>
                <div className="po-mailbox">
                  <label>{p.mailboxLabel}</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={p.mailboxPlaceholder}
                    maxLength={140}
                  />
                  <div className="po-btnrow">
                    <button type="button" className="po-btn pink" onClick={postQuestion}>
                      {p.postBtn}
                    </button>
                    <button type="button" className="po-btn" onClick={fillQuestion}>
                      {p.fillBtn}
                    </button>
                  </div>
                  {help ? (
                    <div className="po-help">
                      <b>{p.helpTitle}</b>
                      <p>{p.helpBody}</p>
                    </div>
                  ) : null}
                </div>

                <h3 style={{ marginTop: 22 }}>{p.playerB}</h3>
                <div className="po-player">
                  <div className="po-avatar">🧑‍🎨</div>
                  <div>
                    <b>{p.aki}</b>
                    <span className="po-badge">{p.localB}</span>
                    <div className="po-status">{statusB}</div>
                  </div>
                  <div className={exclaim ? "po-exclaim show" : "po-exclaim"}>!</div>
                </div>
                <button type="button" className="po-btn cyan" style={{ width: "100%" }} onClick={claimJob}>
                  {p.claimBtn}
                </button>

                <div style={{ marginTop: 14 }}>
                  <label>{p.delayLabel}</label>
                  <select value={delay} onChange={(e) => setDelay(Number(e.target.value))}>
                    <option value={8000}>{p.delay8}</option>
                    <option value={30000}>{p.delay30}</option>
                    <option value={120000}>{p.delay120}</option>
                  </select>
                  <p className="po-small">{p.delayHint}</p>
                </div>
              </div>

              <div className="po-stage" ref={stageRef}>
                <div className="po-stage-title">{p.stageTitle}</div>
                <div className="po-shop">
                  <div className="po-shop-sign">{p.shopSign}</div>
                  <div className="po-shop-window" />
                </div>
                <div className="po-road" />

                <div className="po-character po-char-b" ref={charBRef}>
                  <div className="head">🧑‍🎨</div>
                  <div className="body" />
                  <div className="name">AKI_404</div>
                </div>
                <div className="po-character po-char-a" ref={charARef}>
                  <div className="head">🐷</div>
                  <div className="body po-juju-body" />
                  <div className="name">JUJU_01</div>
                </div>
                <div ref={beamRef} className={beam ? "po-beam show" : "po-beam"} />
                <div className={flying ? "po-bottle3d fly" : "po-bottle3d"} />

                <div className={challenge ? "po-challenge show" : "po-challenge"}>
                  <div className="po-challenge-head">
                    <div>
                      <div className="po-small">{p.challengeHint}</div>
                      <b>{challengeTitle}</b>
                    </div>
                    <div className="po-limiter">{limiterTag}</div>
                  </div>
                  <div className="po-prompt">
                    {p.promptPrefix}
                    {current}
                    {p.promptSuffix}
                  </div>

                  {mode === "draw" ? (
                    <div>
                      <label>{p.drawLabel}</label>
                      <canvas
                        ref={doodleRef}
                        className="po-doodle"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                      />
                      <div className="po-canvas-tools">
                        {[
                          ["#29242a", p.inkBlack],
                          ["#ff6aa9", p.inkPink],
                          ["#6de2e6", p.inkCyan],
                          ["#ffd36a", p.inkAmber],
                        ].map(([c, label]) => (
                          <button key={c} type="button" className="po-btn" onClick={() => (ink.current = c)}>
                            {label}
                          </button>
                        ))}
                        <button type="button" className="po-btn" onClick={prepareCanvas}>
                          {p.rubOut}
                        </button>
                        <button type="button" className="po-btn" onClick={undo}>
                          {p.undo}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {mode === "haiku" ? (
                    <div>
                      <label>{p.haikuLabel}</label>
                      <div className="po-haiku">
                        {(
                          [
                            [h1, setH1, 5, p.haiku5],
                            [h2, setH2, 7, p.haiku7],
                            [h3, setH3, 5, p.haiku5],
                          ] as const
                        ).map(([value, set, n, ph], i) => {
                          const k = countCjk(value);
                          return (
                            <div className="po-haiku-row" key={i}>
                              <input value={value} maxLength={14} placeholder={ph} onChange={(e) => set(e.target.value)} />
                              <div className={k === n ? "po-counter ok" : "po-counter"}>
                                {k} / {n}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {mode === "friend" ? (
                    <div>
                      <label>{p.friendLabel}</label>
                      <textarea value={friend} onChange={(e) => setFriend(e.target.value)} placeholder={p.friendPlaceholder} />
                    </div>
                  ) : null}

                  <div className="po-btnrow">
                    <button type="button" className="po-btn pink" onClick={sendReply}>
                      {p.sendBottle}
                    </button>
                    <button type="button" className="po-btn ghost" onClick={cancelReply}>
                      {p.cancelAi}
                    </button>
                  </div>
                </div>

                <div className={delivery ? "po-delivery show" : "po-delivery"}>
                  <div className="po-small">
                    <span>{p.deliveryText}</span>
                    <span style={{ float: "right" }}>{countdown}</span>
                  </div>
                  <div className="po-bar">
                    <i style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className={letter ? "po-letter show" : "po-letter"}>
                  <div className="po-paper-title">{p.letterTitle}</div>
                  <div className="po-small">{letterMeta}</div>
                  <div className="po-paper-body">{letterBody}</div>
                  {letterImage ? <img className="po-paper-doodle" src={letterImage} alt="" /> : null}
                  <div className="po-rating">
                    <button type="button" className="po-btn pink" onClick={() => rateReply("warm")}>
                      {p.rateWarm}
                    </button>
                    <button type="button" className="po-btn" onClick={() => rateReply("silly")}>
                      {p.rateSilly}
                    </button>
                    <button type="button" className="po-btn" onClick={() => setLetter(false)}>
                      {p.rateSkip}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="po-foot">{p.foot}</div>
        </div>
        <div className={toast ? "po-toast show" : "po-toast"}>{toast}</div>
      </div>
    </main>
  );
}
