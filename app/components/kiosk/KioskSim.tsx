"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { KioskApp } from "@/app/components/kiosk/KioskApp";
import { KioskRuntime } from "@/lib/kiosk/engine";
import {
  applyMissionPass,
  bootMission,
  emptyScore,
  isKioskMissionId,
  kioskMissions,
  NIGHTSHIFT_SCORE_KEY,
  parseNightshiftScore,
  type KioskMission,
  type KioskMissionId,
  type NightshiftScore,
} from "@/lib/kiosk/missions";
import type { KioskLang } from "@/lib/kiosk/types";
import "./kiosk.css";

function useRuntime(runtime: KioskRuntime | null) {
  return useSyncExternalStore(
    (onStoreChange) => (runtime ? runtime.subscribe(onStoreChange) : () => undefined),
    () => runtime?.getState() ?? null,
    () => runtime?.getState() ?? null,
  );
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatClock(now: Date): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function KioskSim({ initialLang = "zh-Hant" }: { initialLang?: KioskLang }) {
  const [lang, setLang] = useState<KioskLang>(initialLang);
  const [score, setScore] = useState<NightshiftScore>(emptyScore);
  const [hydrated, setHydrated] = useState(false);
  const [mission, setMission] = useState<KioskMission | null>(null);
  const [runtime, setRuntime] = useState<KioskRuntime | null>(null);
  const [runId, setRunId] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [bannerXp, setBannerXp] = useState(0);
  const awarded = useRef<number | null>(null);
  const state = useRuntime(runtime);
  const zh = lang === "zh-Hant";

  useEffect(() => {
    setScore(parseNightshiftScore(window.localStorage.getItem(NIGHTSHIFT_SCORE_KEY)));
    setHydrated(true);
    const play = new URLSearchParams(window.location.search).get("play");
    if (play && isKioskMissionId(play)) {
      const booted = bootMission(play, { lang: initialLang, persist: false });
      setLang(initialLang);
      setMission(booted.mission);
      setRuntime(booted.runtime);
      setRunId(Date.now());
    }
  }, [initialLang]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(NIGHTSHIFT_SCORE_KEY, JSON.stringify(score));
  }, [score, hydrated]);

  useEffect(() => {
    setNow(new Date());
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!runtime || !mission) return;
    mission.keep(runtime);
  }, [runtime, mission, state?.step, state?.faults.online, state?.faults.encodeFailNext]);

  const verdict = useMemo(() => {
    if (!mission || !state || mission.id === "free") return null;
    const next = mission.judge(state);
    if (next.open) return null;
    return next;
  }, [mission, state]);

  useEffect(() => {
    if (!verdict?.pass || !mission) return;
    if (awarded.current === runId) return;
    const token = `nightshift:${runId}:${mission.id}`;
    try {
      const key = "ichina.kiosk.nightshift.awards";
      const claimed = new Set<string>(JSON.parse(sessionStorage.getItem(key) || "[]") as string[]);
      if (claimed.has(token)) {
        awarded.current = runId;
        return;
      }
      claimed.add(token);
      sessionStorage.setItem(key, JSON.stringify([...claimed]));
    } catch {
      // sessionStorage may be blocked; still award once per mounted run.
    }
    awarded.current = runId;
    const next = applyMissionPass(score, mission);
    setBannerXp(next.gained);
    setScore(next.score);
  }, [verdict, mission, runId, score]);

  function start(id: KioskMissionId, nextLang: KioskLang = lang) {
    const booted = bootMission(id, { lang: nextLang, persist: false });
    awarded.current = null;
    setBannerXp(0);
    setLang(nextLang);
    setMission(booted.mission);
    setRuntime(booted.runtime);
    setRunId(Date.now());
  }

  function abort() {
    setMission(null);
    setRuntime(null);
  }

  if (!mission || !runtime) {
    return (
      <div className="kiosk-root kiosk-sim" data-testid="kiosk-sim">
        <div className="kiosk-shell kiosk-lobby" data-testid="kiosk-lobby">
          <header className="kiosk-top">
            <div className="kiosk-brand">
              {zh ? "夜班" : "Night shift"}
              <span>{zh ? "自助旅宿 · 聯鎖即規則" : "Hostel kiosk · the interlocks are the rules"}</span>
            </div>
            <div className="kiosk-lang" role="group" aria-label="Language">
              <button type="button" className={zh ? "is-on" : ""} onClick={() => setLang("zh-Hant")}>
                繁體
              </button>
              <button type="button" className={!zh ? "is-on" : ""} onClick={() => setLang("en")}>
                EN
              </button>
            </div>
          </header>

          <p className="kiosk-shift-clock" data-testid="kiosk-mission-clock">
            {zh ? "夜班" : "SHIFT"} {now ? formatClock(now) : ""}
          </p>
          <p className="kiosk-lead">{zh ? "機子就是遊戲。聯鎖不會讓步。" : "The kiosk is the game. The interlocks do not yield."}</p>
          <p className="kiosk-xp" data-testid="kiosk-xp">
            XP {score.xp} · {zh ? "過關" : "cleared"}{" "}
            {kioskMissions.filter((row) => row.id !== "free" && (score.clears[row.id] ?? 0) > 0).length}/4
          </p>

          <div className="kiosk-mission-grid">
            {kioskMissions.map((row, index) => {
              const clears = score.clears[row.id] ?? 0;
              return (
                <button
                  key={row.id}
                  type="button"
                  className="kiosk-mission"
                  data-testid={`mission-${row.id}`}
                  onClick={() => start(row.id)}
                >
                  <span className="kiosk-mission-no">
                    {pad(index + 1)} {clears ? (zh ? `×${clears}` : `×${clears}`) : ""}
                  </span>
                  <strong>{zh ? row.titleZh : row.titleEn}</strong>
                  <span>{zh ? row.briefZh : row.briefEn}</span>
                  {row.xp > 0 ? <em>XP {row.xp}</em> : <em>{zh ? "無裁判" : "No judge"}</em>}
                </button>
              );
            })}
          </div>

          <p className="kiosk-lobby-foot">
            <Link href="/game">{zh ? "← 遊戲" : "← Games"}</Link>
            <span>{zh ? "同一台狀態機。沒有跳過聯鎖的捷徑。" : "Same state machine. No skip for the interlocks."}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-root kiosk-sim" data-testid="kiosk-sim">
      <div className="kiosk-hud" data-testid="kiosk-hud">
        <div>
          <p className="kiosk-shift-clock">
            {zh ? "夜班" : "SHIFT"} {now ? formatClock(now) : ""} · {mission.id.toUpperCase()}
          </p>
          <strong>{zh ? mission.titleZh : mission.titleEn}</strong>
          <p>{zh ? mission.hintZh : mission.hintEn}</p>
        </div>
        <div className="kiosk-hud-actions">
          <span data-testid="kiosk-hud-wan">
            {state?.health.online ? (zh ? "專線" : "WAN") : zh ? "斷網" : "WAN DOWN"}
          </span>
          <button type="button" className="kiosk-btn ghost" data-testid="kiosk-abort" onClick={abort}>
            {zh ? "中止" : "Abort"}
          </button>
        </div>
      </div>
      <KioskApp
        key={runId}
        runtime={runtime}
        initialLang={lang}
        idleMs={mission.id === "free" ? 45000 : 0}
        encodeDelayMs={720}
        showOperator={mission.id === "free"}
        embedded
      />
      {verdict ? (
        <div
          className={`kiosk-verdict ${verdict.pass ? "is-pass" : "is-fail"}`}
          data-testid="kiosk-verdict"
          data-pass={verdict.pass ? "true" : "false"}
        >
          <p className="kiosk-lead">{zh ? verdict.titleZh : verdict.titleEn}</p>
          <p>{zh ? verdict.detailZh : verdict.detailEn}</p>
          {verdict.pass && bannerXp > 0 ? <p className="kiosk-xp">+{bannerXp} XP</p> : null}
          <div className="kiosk-grid two">
            <button type="button" className="kiosk-btn primary" data-testid="kiosk-retry" onClick={() => start(mission.id)}>
              {zh ? "再來一班" : "Run it again"}
            </button>
            <button type="button" className="kiosk-btn ghost" data-testid="kiosk-to-lobby" onClick={abort}>
              {zh ? "返回大廳" : "Back to lobby"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
