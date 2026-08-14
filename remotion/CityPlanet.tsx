import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CITY_PLANET_WIDTH = 1920;
export const CITY_PLANET_HEIGHT = 1080;
export const CITY_PLANET_FPS = 30;
export const CITY_PLANET_DURATION = 270;
export const WORLDS_DURATION = 135;

export type CityPlanetProps = {
  worldsTitle: string;
  worldsLine: string;
  worldsLower: string;
  planetTitle: string;
  planetLine: string;
  planetLower: string;
};

const BG = "#0A0A0A";
const DEEP = "#0B2422";
const TEAL = "#14B8A6";
const PINK = "#EC4899";
const CREAM = "#F5F0E6";
const MUTED = "#A3A3A3";
const GOLD = "#C7A25B";

const display =
  'var(--font-display), ui-sans-serif, system-ui, "Segoe UI", sans-serif';
const mono = 'var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace';

function clampEase(frame: number, input: [number, number], output: [number, number]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function splitCaption(text: string): string[] {
  if (/\s/.test(text)) {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }
  const chars = Array.from(text);
  const chunks: string[] = [];
  for (let i = 0; i < chars.length; i += 2) {
    chunks.push(chars.slice(i, i + 2).join(""));
  }
  return chunks;
}

function TimedLine({
  text,
  start,
  stagger = 4,
  style,
}: {
  text: string;
  start: number;
  stagger?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const parts = splitCaption(text);

  return (
    <p style={{ margin: 0, ...style }}>
      {parts.map((part, i) => {
        const appear = start + i * stagger;
        const opacity = interpolate(frame, [appear, appear + 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [appear, appear + 8], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={`${part}-${i}`}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              whiteSpace: part.trim() ? "pre" : "pre",
            }}
          >
            {part}
          </span>
        );
      })}
    </p>
  );
}

function FilmGrain() {
  const frame = useCurrentFrame();
  const flicker = interpolate(frame % 6, [0, 3, 6], [0.07, 0.11, 0.07], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: flicker,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.9'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Letterbox() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 92,
          background: BG,
          zIndex: 8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 92,
          background: BG,
          zIndex: 8,
        }}
      />
    </>
  );
}

function Scanlines() {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.18,
        background:
          "repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,0.03) 3px 4px)",
      }}
    />
  );
}

function Haze({
  a,
  b,
  shiftX,
  shiftY,
  scale,
}: {
  a: string;
  b: string;
  shiftX: number;
  shiftY: number;
  scale: number;
}) {
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shiftX}px, ${shiftY}px) scale(${scale})`,
        background: `radial-gradient(ellipse at 68% 32%, ${a}, transparent 54%), radial-gradient(ellipse at 18% 78%, ${b}, transparent 50%), radial-gradient(circle at 50% 50%, ${DEEP} 0%, ${BG} 72%)`,
      }}
    />
  );
}

function CityPlanetShape({
  tone,
  rotate,
  size,
}: {
  tone: "worlds" | "planet";
  rotate: number;
  size: number;
}) {
  const glow = tone === "worlds" ? TEAL : GOLD;
  const land = tone === "worlds" ? "#0E3D38" : "#1A2A22";
  const spark = tone === "worlds" ? PINK : TEAL;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 520 520"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`globe-${tone}`} cx="34%" cy="30%" r="70%">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0.95" />
          <stop offset="28%" stopColor={glow} />
          <stop offset="68%" stopColor={DEEP} />
          <stop offset="100%" stopColor="#041614" />
        </radialGradient>
        <linearGradient id={`ring-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={glow} stopOpacity="0.15" />
          <stop offset="50%" stopColor={glow} stopOpacity="0.85" />
          <stop offset="100%" stopColor={PINK} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <ellipse
        cx="260"
        cy="268"
        rx="228"
        ry="72"
        fill="none"
        stroke={`url(#ring-${tone})`}
        strokeWidth="2.2"
        transform={`rotate(${rotate} 260 260)`}
        opacity="0.9"
      />
      <ellipse
        cx="260"
        cy="268"
        rx="196"
        ry="54"
        fill="none"
        stroke={glow}
        strokeOpacity="0.28"
        strokeWidth="1"
        transform={`rotate(${rotate * 0.6} 260 260)`}
      />
      <circle cx="260" cy="260" r="148" fill={`url(#globe-${tone})`} />
      <circle
        cx="260"
        cy="260"
        r="148"
        fill="none"
        stroke={glow}
        strokeOpacity="0.28"
        strokeWidth="1.4"
      />
      {tone === "planet"
        ? [0, 35, 70, 105, 140].map((y) => (
            <ellipse
              key={y}
              cx="260"
              cy={190 + y * 0.55}
              rx={Math.max(40, 148 - Math.abs(y - 70) * 0.85)}
              ry="10"
              fill="none"
              stroke={CREAM}
              strokeOpacity="0.12"
            />
          ))
        : null}
      {[
        [198, 214, 18, 42],
        [228, 198, 14, 58],
        [252, 188, 16, 72],
        [278, 204, 13, 50],
        [304, 218, 20, 38],
        [188, 268, 22, 34],
        [318, 262, 16, 40],
        [236, 292, 28, 24],
        [274, 288, 18, 30],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="2"
          fill={i % 3 === 0 ? glow : land}
          opacity={i % 3 === 0 ? 0.72 : 0.45}
        />
      ))}
      <circle cx="372" cy="168" r="6" fill={spark} />
      <circle cx="372" cy="168" r="14" fill={spark} opacity="0.22" />
    </svg>
  );
}

function LowerThird({
  path,
  title,
  line,
  lower,
  accent,
}: {
  path: string;
  title: string;
  line: string;
  lower: string;
  accent: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.7 },
  });
  const titleIn = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        bottom: 128,
        zIndex: 6,
        transform: `translateY(${interpolate(bar, [0, 1], [36, 0])}px)`,
        opacity: bar,
      }}
    >
      <div
        style={{
          height: 2,
          width: `${interpolate(bar, [0, 1], [8, 100])}%`,
          background: accent,
          boxShadow: `0 0 18px ${accent}`,
        }}
      />
      <div
        style={{
          padding: "22px 0 0",
          background:
            "linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0) 100%)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {path}
        </p>
        <h3
          style={{
            margin: "14px 0 0",
            fontFamily: display,
            fontSize: 72,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: CREAM,
            fontWeight: 500,
            transform: `translateY(${interpolate(titleIn, [0, 1], [16, 0])}px)`,
            opacity: titleIn,
          }}
        >
          {title}
        </h3>
        <TimedLine
          text={line}
          start={16}
          stagger={3}
          style={{
            marginTop: 18,
            fontFamily: display,
            fontSize: 28,
            lineHeight: 1.25,
            color: CREAM,
            maxWidth: 920,
          }}
        />
        <TimedLine
          text={lower}
          start={34}
          stagger={3}
          style={{
            marginTop: 10,
            fontFamily: mono,
            fontSize: 18,
            color: MUTED,
          }}
        />
      </div>
    </div>
  );
}

function Progress({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const width = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 92,
        height: 2,
        background: "rgba(255,255,255,0.08)",
        zIndex: 9,
      }}
    >
      <div style={{ width: `${width}%`, height: "100%", background: accent }} />
    </div>
  );
}

function WorldsScene({
  worldsTitle,
  worldsLine,
  worldsLower,
}: Pick<CityPlanetProps, "worldsTitle" | "worldsLine" | "worldsLower">) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ken = interpolate(frame, [0, durationInFrames], [1, 1.14], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  });
  const pan = interpolate(frame, [0, durationInFrames], [24, -48], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  });
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const spin = interpolate(frame, [0, durationInFrames], [-12, 16]);

  return (
    <AbsoluteFill>
      <Haze
        a="rgba(20,184,166,0.32)"
        b="rgba(236,72,153,0.16)"
        shiftX={pan * 0.35}
        shiftY={interpolate(frame, [0, durationInFrames], [0, -20], {
          extrapolateRight: "clamp",
        })}
        scale={ken}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${120 + pan}px, ${interpolate(rise, [0, 1], [40, -10])}px) scale(${ken})`,
        }}
      >
        <CityPlanetShape tone="worlds" rotate={spin} size={620} />
      </AbsoluteFill>
      <Scanlines />
      <FilmGrain />
      <LowerThird
        path="gghere.com/hk"
        title={worldsTitle}
        line={worldsLine}
        lower={worldsLower}
        accent={TEAL}
      />
    </AbsoluteFill>
  );
}

function PlanetScene({
  planetTitle,
  planetLine,
  planetLower,
}: Pick<CityPlanetProps, "planetTitle" | "planetLine" | "planetLower">) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ken = interpolate(frame, [0, durationInFrames], [1.12, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  });
  const pan = interpolate(frame, [0, durationInFrames], [-30, 36], {
    easing: Easing.inOut(Easing.quad),
    extrapolateRight: "clamp",
  });
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const spin = interpolate(frame, [0, durationInFrames], [18, -10]);

  return (
    <AbsoluteFill>
      <Haze
        a="rgba(199,162,91,0.28)"
        b="rgba(20,184,166,0.18)"
        shiftX={pan * 0.3}
        shiftY={interpolate(frame, [0, durationInFrames], [-12, 16], {
          extrapolateRight: "clamp",
        })}
        scale={ken}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${-40 + pan}px, ${interpolate(rise, [0, 1], [28, 8])}px) scale(${ken})`,
        }}
      >
        <CityPlanetShape tone="planet" rotate={spin} size={700} />
      </AbsoluteFill>
      <Scanlines />
      <FilmGrain />
      <LowerThird
        path="jubuddy.com/planet"
        title={planetTitle}
        line={planetLine}
        lower={planetLower}
        accent={TEAL}
      />
    </AbsoluteFill>
  );
}

export function CityPlanet({
  worldsTitle,
  worldsLine,
  worldsLower,
  planetTitle,
  planetLine,
  planetLower,
}: CityPlanetProps) {
  const frame = useCurrentFrame();
  const fade = clampEase(frame, [WORLDS_DURATION - 8, WORLDS_DURATION + 6], [1, 0]);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence durationInFrames={WORLDS_DURATION + 8} name="worlds">
        <AbsoluteFill style={{ opacity: frame < WORLDS_DURATION ? 1 : fade }}>
          <WorldsScene
            worldsTitle={worldsTitle}
            worldsLine={worldsLine}
            worldsLower={worldsLower}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={WORLDS_DURATION} name="planet">
        <PlanetScene
          planetTitle={planetTitle}
          planetLine={planetLine}
          planetLower={planetLower}
        />
      </Sequence>
      <Letterbox />
      <Progress accent={TEAL} />
    </AbsoluteFill>
  );
}

export const cityPlanetDefaultProps: CityPlanetProps = {
  worldsTitle: "gghere HK",
  worldsLine: "24 cities. Walkable planets.",
  worldsLower: "No account.",
  planetTitle: "jubuddy planet",
  planetLine: "The city-planet surface.",
  planetLower: "Sibling to worlds.",
};
