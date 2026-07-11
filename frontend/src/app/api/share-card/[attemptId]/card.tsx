/**
 * Satori-compatible layouts for the share-card image route (1080×1920 story
 * format). Not a route file — colocated helper rendered by ./route.tsx via
 * next/og ImageResponse. Inline styles + flex only.
 *
 * Visual system: "Clean Editorial" — crimson (#E8174B) brand accent matching
 * the app primary, subtle grid texture, red top bar, Poppins type. Every card
 * renders in a light or dark palette chosen from the viewer's theme.
 */

export type CardTheme = "light" | "dark";

export interface CardFooter {
  /** Left-hand footer line — the learner's name (empty for guest cards). */
  left: string;
}

const ACCENT = "#E8174B";

const FONT = "Poppins";

interface Palette {
  bg: string;
  text: string;
  text2: string;
  muted: string;
  mutedScore: string;
  eyebrow: string;
  border: string;
  track: string;
  grid: string;
  rowBg: string;
  rowBorder: string;
  badgeBg: string;
  badgeText: string;
}

function palette(theme: CardTheme): Palette {
  return theme === "dark"
    ? {
        bg: "#0E0F12",
        text: "#F4F5F7",
        text2: "#C7C9CD",
        muted: "#7C7F87",
        mutedScore: "#55585F",
        eyebrow: "#FF6E8A",
        border: "#26282E",
        track: "#26282E",
        grid: "rgba(255,255,255,0.045)",
        rowBg: "#1A1C21",
        rowBorder: "#26282E",
        badgeBg: "#F4F5F7",
        badgeText: "#101113",
      }
    : {
        bg: "#FAFAF9",
        text: "#101113",
        text2: "#2C2F35",
        muted: "#9A9EA5",
        mutedScore: "#C7C9CD",
        eyebrow: "#E8174B",
        border: "#ECECEE",
        track: "#ECECEE",
        grid: "rgba(16,17,19,0.04)",
        rowBg: "#F2F2F0",
        rowBorder: "#ECECEE",
        badgeBg: "#101113",
        badgeText: "#FFFFFF",
      };
}

function formatBand(band: number): string {
  return band.toFixed(1);
}

function Shell({
  theme,
  eyebrow,
  title,
  footer,
  children,
}: {
  theme: CardTheme;
  eyebrow: string;
  title: string;
  footer: CardFooter;
  children: React.ReactNode;
}) {
  const p = palette(theme);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: p.bg,
        fontFamily: FONT,
        padding: "128px 96px 112px",
      }}
    >
      {/* grid texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${p.grid} 2px, transparent 2px), linear-gradient(90deg, ${p.grid} 2px, transparent 2px)`,
          backgroundSize: "86px 86px",
        }}
      />
      {/* top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 20,
          background: ACCENT,
        }}
      />

      {/* header */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 84 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 48,
              marginRight: 28,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: p.text }}>
            BandUp
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: p.eyebrow,
            marginBottom: 26,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 600, color: p.text }}>
          {title}
        </div>
      </div>

      {/* body fills remaining space, footer pinned to bottom */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>

      {/* footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: 52,
          borderTop: `2px solid ${p.border}`,
        }}
      >
        <div style={{ display: "flex", fontSize: 42, fontWeight: 600, color: p.text }}>
          {footer.left}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: p.eyebrow }}>
          bandup.uz
        </div>
      </div>
    </div>
  );
}

/** Reading / listening: big raw score + level badge + progress bar + quote. */
export function ModuleCard({
  theme,
  moduleLabel,
  title,
  raw,
  total,
  level,
  pct,
  quote,
  footer,
}: {
  theme: CardTheme;
  moduleLabel: string;
  title: string;
  raw: number;
  total: number;
  level: string;
  pct: number;
  quote: string;
  footer: CardFooter;
}) {
  const p = palette(theme);
  return (
    <Shell theme={theme} eyebrow={`IELTS ${moduleLabel} · Result`} title={title} footer={footer}>
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: 96 }}>
        <div style={{ display: "flex", fontSize: 250, fontWeight: 800, color: p.text, lineHeight: 0.9 }}>
          {raw}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 600,
            color: p.mutedScore,
            marginLeft: 14,
            marginBottom: 22,
          }}
        >
          {`/${total}`}
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 34 }}>
        <div
          style={{
            display: "flex",
            padding: "16px 40px",
            borderRadius: 16,
            background: p.badgeBg,
            color: p.badgeText,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {level}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: 28,
          borderRadius: 99,
          background: p.track,
          marginTop: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${Math.max(4, Math.min(100, pct))}%`,
            height: 28,
            borderRadius: 99,
            background: ACCENT,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 48,
          fontWeight: 500,
          color: p.text2,
          lineHeight: 1.4,
          marginTop: 68,
        }}
      >
        {quote}
      </div>
    </Shell>
  );
}

/** Writing / speaking: band hero + 4 criteria bars + quote. */
export function CriteriaCard({
  theme,
  moduleLabel,
  title,
  band,
  criteria,
  quote,
  footer,
}: {
  theme: CardTheme;
  moduleLabel: string;
  title: string;
  band: number;
  criteria: { name: string; score: number }[];
  quote: string;
  footer: CardFooter;
}) {
  const p = palette(theme);
  return (
    <Shell theme={theme} eyebrow={`IELTS ${moduleLabel} · Result`} title={title} footer={footer}>
      <div style={{ display: "flex", fontSize: 230, fontWeight: 800, color: p.text, lineHeight: 0.9, marginTop: 84 }}>
        {formatBand(band)}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: p.muted,
          marginTop: 14,
          marginBottom: 56,
        }}
      >
        / 9.0 IELTS Band
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {criteria.map((c) => (
          <div key={c.name} style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: 38 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", fontSize: 42, fontWeight: 500, color: p.text2 }}>
                {c.name}
              </div>
              <div style={{ display: "flex", fontSize: 42, fontWeight: 700, color: p.eyebrow }}>
                {formatBand(c.score)}
              </div>
            </div>
            <div style={{ display: "flex", width: "100%", height: 18, borderRadius: 99, background: p.track }}>
              <div
                style={{
                  display: "flex",
                  width: `${Math.max(3, Math.min(100, (c.score / 9) * 100))}%`,
                  height: 18,
                  borderRadius: 99,
                  background: ACCENT,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", fontSize: 44, fontWeight: 500, color: p.text2, lineHeight: 1.4, marginTop: 18 }}>
        {quote}
      </div>
    </Shell>
  );
}

/** Full mock test: overall band hero + 4 module rows ("—" when pending). */
export function MockCard({
  theme,
  title,
  overallBand,
  modules,
  footer,
}: {
  theme: CardTheme;
  title: string;
  overallBand: number;
  modules: { label: string; color: string; band: number | null }[];
  footer: CardFooter;
}) {
  const p = palette(theme);
  return (
    <Shell theme={theme} eyebrow="Full IELTS Mock Test" title={title} footer={footer}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: 76 }}>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: p.muted,
            marginBottom: 8,
          }}
        >
          Overall Band
        </div>
        <div style={{ display: "flex", fontSize: 210, fontWeight: 800, color: p.text, lineHeight: 0.9 }}>
          {overallBand > 0 ? formatBand(overallBand) : "—"}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%", marginTop: 64 }}>
        {modules.map((m) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "30px 40px",
              borderRadius: 26,
              background: p.rowBg,
              border: `2px solid ${p.rowBorder}`,
              marginBottom: 22,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: 24,
                  height: 24,
                  borderRadius: 99,
                  background: m.color,
                  marginRight: 26,
                }}
              />
              <div style={{ display: "flex", fontSize: 44, fontWeight: 600, color: p.text }}>
                {m.label}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: m.band !== null ? p.text : p.muted,
              }}
            >
              {m.band !== null ? formatBand(m.band) : "—"}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
