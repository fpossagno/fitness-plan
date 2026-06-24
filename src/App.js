import { useState, useEffect, useRef } from "react";

const COLORS = {
  black: "#0a0a0a",
  charcoal: "#161616",
  panel: "#1e1e1e",
  border: "#2e2e2e",
  lime: "#c8f135",
  limeDim: "#8aaa22",
  white: "#f0f0eb",
  muted: "#777",
  blue: "#4a9eff",
  orange: "#f5a623",
  red: "#e84040",
};

// Reliable Wger open-source exercise GIFs (no API key, CORS-friendly)
const BASE = "https://wger.de/api/v2";

const GYM = [
  { name: "Goblet Squat / Leg Press", sets: "3 × 12", muscle: "Quads + Glutes", tip: "Keep chest up, drive through heels", wgerId: 69, emoji: "🦵" },
  { name: "Romanian Deadlift", sets: "3 × 10", muscle: "Hamstrings + Lower Back", tip: "Hinge at hips, bar close to legs, slight knee bend", wgerId: 120, emoji: "🏋️" },
  { name: "Chest Press", sets: "3 × 12", muscle: "Chest + Triceps", tip: "Full range, controlled descent, elbows at 45°", wgerId: 192, emoji: "💪" },
  { name: "Cable / Seated Row", sets: "3 × 12", muscle: "Back + Biceps", tip: "Pull elbows back, squeeze shoulder blades at peak", wgerId: 61, emoji: "🔙" },
  { name: "Shoulder Press", sets: "3 × 10", muscle: "Shoulders", tip: "Don't fully lock out at top, steady controlled tempo", wgerId: 73, emoji: "🙆" },
  { name: "Lat Pulldown", sets: "3 × 12", muscle: "Lats + Upper Back", tip: "Pull bar to upper chest, lean back slightly", wgerId: 122, emoji: "⬇️" },
  { name: "Plank", sets: "3 × 40 sec", muscle: "Core + Stability", tip: "Hips level, breathe steadily, don't hold breath", wgerId: 10, emoji: "⬜" },
  { name: "Incline Treadmill Walk", sets: "10 min", muscle: "Cardio + Fat Burn", tip: "Incline 8–12%, 5–6 km/h, don't hold the rails", wgerId: 160, emoji: "🚶" },
];

const HOME = [
  { name: "Jumping Jacks", dur: 40, muscle: "Full body warm-up", tip: "Controlled rhythm, land softly on balls of feet", wgerId: 364, emoji: "⭐" },
  { name: "Bodyweight Squats", dur: 40, muscle: "Quads + Glutes", tip: "Feet shoulder-width, chest up, sit back into it", wgerId: 69, emoji: "🦵" },
  { name: "Same-Side Knee to Elbow", dur: 40, muscle: "Obliques + Balance", tip: "Standing — lift right knee while right elbow comes down. Slow and controlled.", wgerId: 124, emoji: "🔄" },
  { name: "Opposite Knee Raises", dur: 40, muscle: "Core + Hip Flexors", tip: "Lift left knee while twisting right elbow toward it. Standing crunch.", wgerId: 124, emoji: "🔃" },
  { name: "Push-Ups", dur: 40, muscle: "Chest + Triceps", tip: "On knees if needed. Full chest to floor, arms at 45°", wgerId: 192, emoji: "💪" },
  { name: "Reverse Lunges", dur: 40, muscle: "Glutes + Quads", tip: "Step back, not forward. Keep front knee over ankle.", wgerId: 185, emoji: "🦶" },
  { name: "High Knees", dur: 40, muscle: "Cardio + Core", tip: "Drive knees to hip height, pump arms, stay on toes", wgerId: 160, emoji: "🏃" },
  { name: "Glute Bridges", dur: 40, muscle: "Glutes + Lower Back", tip: "Lie on floor, feet flat. Drive hips up and squeeze at top.", wgerId: 253, emoji: "🌉" },
  { name: "Mountain Climbers", dur: 40, muscle: "Core + Cardio", tip: "Plank position — drive knees alternately to chest. Keep hips level.", wgerId: 10, emoji: "🏔️" },
  { name: "Deep Breath Stretch", dur: 20, muscle: "Recovery", tip: "Hands overhead, inhale deeply for 4 counts, exhale for 4", wgerId: 356, emoji: "🧘" },
];

const SCHEDULE = [
  { day: "Mon", label: "Full Body Gym", icon: "🏋️", type: "gym" },
  { day: "Tue", label: "10-min Home Circuit", icon: "🏠", type: "home" },
  { day: "Wed", label: "Full Body Gym", icon: "🏋️", type: "gym" },
  { day: "Thu", label: "10-min Home Circuit", icon: "🏠", type: "home" },
  { day: "Fri", label: "Full Body Gym", icon: "🏋️", type: "gym" },
  { day: "Sat", label: "Walk 30–45 min", icon: "🚶", type: "walk" },
  { day: "Sun", label: "Rest & Recovery", icon: "😴", type: "rest" },
];

const SUPPS = [
  { tier: 1, name: "Whey Isolate Protein", dose: "25–30g · 1–2x daily", desc: "Keeps you full, preserves muscle while losing fat, repairs tissue after training.", buy: "Optimum Nutrition Gold Standard or Myprotein Whey Isolate (Gymgrossisten.se)" },
  { tier: 1, name: "Creatine Monohydrate", dose: "5g · every day", desc: "Most researched supplement in existence. Increases strength, speeds recovery. Emerging evidence for cognitive benefits — relevant to work stress.", buy: "Creapure (German ultra-pure) — Bodystore.se or Gymgrossisten.se" },
  { tier: 2, name: "Magnesium Glycinate", dose: "300–400mg · before bed", desc: "Your stress supplement. Regulates cortisol, improves sleep quality, reduces muscle cramps. Get glycinate form — NOT oxide.", buy: null },
  { tier: 2, name: "Vitamin D3 + K2", dose: "2000–4000 IU D3 + 100mcg K2 · daily", desc: "Living in Scandinavia = deficient 6+ months/year. Supports testosterone, mood, immune function and energy.", buy: "Available at Apoteket" },
  { tier: 2, name: "Omega-3 Fish Oil", dose: "2–3g EPA+DHA · daily", desc: "Reduces inflammation from training, supports heart health, solid evidence for cortisol reduction under stress.", buy: "Möller's or Lysi — great Nordic options" },
];

const ROUTINE = [
  { time: "Morning", action: "D3 + K2 with breakfast · Omega-3" },
  { time: "Pre-gym", action: "Light meal with carbs + protein" },
  { time: "Post-gym", action: "Whey shake 25–30g within 60 min" },
  { time: "Anytime", action: "Creatine 5g (consistency > timing)" },
  { time: "Evening", action: "Magnesium glycinate before bed" },
];

// ── Shared styles ──────────────────────────────────────────
const S = {
  page: { background: COLORS.black, minHeight: "100vh", color: COLORS.white, fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 14 },
  header: { background: COLORS.charcoal, borderBottom: `2px solid ${COLORS.lime}`, padding: "28px 20px 20px", textAlign: "center" },
  eyebrow: { fontFamily: "system-ui", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLORS.lime, marginBottom: 8 },
  h1: { fontSize: "clamp(38px, 9vw, 64px)", fontWeight: 900, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1, margin: 0 },
  subtitle: { marginTop: 8, color: COLORS.muted, fontSize: 13, fontWeight: 300 },
  nav: { display: "flex", overflowX: "auto", background: COLORS.charcoal, borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 100 },
  navBtn: (active) => ({ flex: "0 0 auto", padding: "13px 18px", background: "none", border: "none", borderBottom: `3px solid ${active ? COLORS.lime : "transparent"}`, color: active ? COLORS.lime : COLORS.muted, fontFamily: "system-ui", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }),
  section: { padding: "20px 16px 60px", maxWidth: 680, margin: "0 auto" },
  secTitle: { fontSize: 28, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  secDesc: { color: COLORS.muted, fontSize: 13, marginBottom: 20 },
  card: { background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 },
  panel: { background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 },
  badge: (color) => ({ display: "inline-block", background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3, marginRight: 6 }),
};

// ── ExerciseCard ──────────────────────────────────────────
function ExerciseCard({ ex, index, type }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    fetch(`https://wger.de/api/v2/exerciseimage/?exercise_base=${ex.wgerId}&format=json`)
      .then(r => r.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setImgUrl(data.results[0].image);
        } else {
          setImgErr(true);
        }
      })
      .catch(() => setImgErr(true));
  }, [ex.wgerId]);

  return (
    <div style={S.card}>
      {imgUrl && !imgErr ? (
        <img src={imgUrl} alt={ex.name} onError={() => { setImgUrl(null); setImgErr(true); }}
          style={{ width: "100%", height: 190, objectFit: "cover", display: "block", background: "#1a1a1a" }} />
      ) : imgErr ? (
        <div style={{ width: "100%", height: 190, background: "linear-gradient(135deg,#1a2a1a,#2a3a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
          {ex.emoji}
        </div>
      ) : (
        <div style={{ width: "100%", height: 190, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexDirection: "column" }}>
          <span style={{ fontSize: 36 }}>{ex.emoji}</span>
          <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1 }}>Loading...</span>
        </div>
      )}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontWeight: 900, fontSize: 18, textTransform: "uppercase", marginBottom: 6 }}>
          {index + 1}. {ex.name}
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={S.badge(COLORS.lime)}>{type === "gym" ? ex.sets : ex.dur + " sec"}</span>
          <span style={S.badge(COLORS.blue)}>{ex.muscle}</span>
        </div>
        <div style={{ color: "#aaa", fontSize: 13 }}>💡 {ex.tip}</div>
      </div>
    </div>
  );
}

// ── Timer ─────────────────────────────────────────────────
function Timer() {
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | go | rest | done
  const intervalRef = useRef(null);
  const stateRef = useRef({ idx: 0, round: 1, timeLeft: 40, phase: "idle" });

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const tick = () => {
    const st = stateRef.current;
    const next = st.timeLeft - 1;
    if (next <= 0) {
      if (st.phase === "rest") {
        const ns = { idx: 0, round: 2, timeLeft: HOME[0].dur, phase: "go" };
        stateRef.current = ns;
        setIdx(0); setRound(2); setTimeLeft(HOME[0].dur); setPhase("go");
      } else {
        const ni = st.idx + 1;
        if (ni >= HOME.length) {
          if (st.round === 1) {
            const ns = { ...st, timeLeft: 60, phase: "rest" };
            stateRef.current = ns;
            setTimeLeft(60); setPhase("rest");
          } else {
            clearInterval(intervalRef.current);
            setRunning(false);
            setPhase("done");
            stateRef.current = { ...st, phase: "done" };
          }
        } else {
          const dur = HOME[ni].dur;
          const ns = { ...st, idx: ni, timeLeft: dur, phase: "go" };
          stateRef.current = ns;
          setIdx(ni); setTimeLeft(dur); setPhase("go");
        }
      }
    } else {
      stateRef.current = { ...st, timeLeft: next };
      setTimeLeft(next);
    }
  };

  const toggle = () => {
    if (phase === "idle" || phase === "done") {
      const dur = HOME[0].dur;
      stateRef.current = { idx: 0, round: 1, timeLeft: dur, phase: "go" };
      setIdx(0); setRound(1); setTimeLeft(dur); setPhase("go");
      setRunning(true);
      intervalRef.current = setInterval(tick, 1000);
    } else if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      intervalRef.current = setInterval(tick, 1000);
      setRunning(true);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    stateRef.current = { idx: 0, round: 1, timeLeft: 40, phase: "idle" };
    setIdx(0); setRound(1); setTimeLeft(40); setPhase("idle"); setRunning(false);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const clockColor = phase === "rest" ? COLORS.blue : phase === "done" ? COLORS.orange : COLORS.lime;
  const exLabel = phase === "idle" ? "Press START to begin" : phase === "rest" ? "🔥 Rest — Round 2 incoming!" : phase === "done" ? "🎉 Workout Complete!" : HOME[idx].name;

  return (
    <div>
      <div style={{ ...S.panel, textAlign: "center", marginBottom: 14, borderColor: phase === "go" ? COLORS.lime : COLORS.border }}>
        <div style={{ fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: 1, color: clockColor, marginBottom: 4 }}>{exLabel}</div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: -2, color: clockColor }}>{fmt(timeLeft)}</div>
        <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Round {round} of 2</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button onClick={toggle} style={{ padding: "12px 32px", background: COLORS.lime, color: COLORS.black, border: "none", borderRadius: 6, fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
          {phase === "idle" || phase === "done" ? "▶ Start" : running ? "⏸ Pause" : "▶ Resume"}
        </button>
        <button onClick={reset} style={{ padding: "12px 24px", background: COLORS.border, color: COLORS.white, border: "none", borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>↺ Reset</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {HOME.map((ex, i) => {
          const isCurrent = phase === "go" && i === idx;
          const isDone = (phase === "go" && i < idx) || (phase === "rest") || (phase === "done");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: isCurrent ? "rgba(200,241,53,0.08)" : COLORS.panel, border: `1px solid ${isCurrent ? COLORS.lime : COLORS.border}`, borderRadius: 6, opacity: isDone ? 0.35 : 1, transition: "all 0.3s" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: isCurrent ? COLORS.lime : COLORS.muted, width: 24 }}>{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{isDone ? "✓ " : ""}{ex.name}</span>
              <span style={{ color: COLORS.muted, fontSize: 12 }}>{ex.dur}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tracker ───────────────────────────────────────────────
function Tracker() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fit_entries") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ weight: "", waist: "", energy: "", sleep: "", stress: "" });
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!form.weight && !form.waist) return;
    const entry = { date: new Date().toLocaleDateString("sv-SE"), ...form };
    const next = [entry, ...entries].slice(0, 20);
    setEntries(next);
    try { localStorage.setItem("fit_entries", JSON.stringify(next)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm({ weight: "", waist: "", energy: "", sleep: "", stress: "" });
  };

  const fields = [
    { key: "weight", label: "⚖️ Weight", unit: "kg", placeholder: "e.g. 82.5" },
    { key: "waist", label: "📏 Waist", unit: "cm", placeholder: "e.g. 90" },
    { key: "energy", label: "⚡ Energy", unit: "/10", placeholder: "1–10" },
    { key: "sleep", label: "😴 Sleep", unit: "hrs", placeholder: "e.g. 7.5" },
    { key: "stress", label: "🧠 Stress", unit: "/10", placeholder: "1=low, 10=high" },
  ];

  return (
    <div>
      <div style={S.panel}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 18, textTransform: "uppercase" }}>This Week</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>{new Date().toLocaleDateString("sv-SE")}</div>
        </div>
        {fields.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ color: COLORS.muted, fontSize: 13, width: 110, flexShrink: 0 }}>{f.label}</span>
            <input type="number" step="0.1" value={form[f.key]} placeholder={f.placeholder}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ flex: 1, background: COLORS.charcoal, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.white, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <span style={{ color: COLORS.muted, fontSize: 12, width: 28 }}>{f.unit}</span>
          </div>
        ))}
        <button onClick={save} style={{ width: "100%", padding: 13, background: COLORS.lime, color: COLORS.black, border: "none", borderRadius: 6, fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginTop: 4 }}>
          Save This Week
        </button>
        {saved && <div style={{ textAlign: "center", color: COLORS.lime, fontSize: 13, marginTop: 8 }}>✓ Saved!</div>}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>📊 History</div>
        {entries.length === 0 ? (
          <div style={{ color: COLORS.muted, textAlign: "center", padding: 24, fontSize: 13 }}>No entries yet — log your first week above.</div>
        ) : entries.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 12px", background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: COLORS.muted, width: 80, flexShrink: 0 }}>{e.date}</span>
            <span style={{ fontWeight: 700, width: 60 }}>{e.weight ? e.weight + " kg" : "—"}</span>
            <span style={{ color: COLORS.blue, width: 56 }}>{e.waist ? e.waist + " cm" : "—"}</span>
            <span style={{ color: COLORS.orange, fontSize: 12 }}>⚡{e.energy||"—"} 😴{e.sleep||"—"}h 🧠{e.stress||"—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
const TABS = [
  { id: "supplements", label: "💊 Supps" },
  { id: "gym", label: "🏋️ Gym" },
  { id: "home", label: "🏠 Home" },
  { id: "schedule", label: "📅 Week" },
  { id: "tracker", label: "📈 Track" },
];

export default function App() {
  const [tab, setTab] = useState("supplements");

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.eyebrow}>Personal Fitness Plan</div>
        <h1 style={S.h1}>Train <span style={{ color: COLORS.lime }}>Hard.</span><br />Live Better.</h1>
        <p style={S.subtitle}>Fat loss · Stress relief · Strength · Feel good</p>
      </div>

      {/* Nav */}
      <div style={S.nav}>
        {TABS.map(t => (
          <button key={t.id} style={S.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Supplements */}
      {tab === "supplements" && (
        <div style={S.section}>
          <div style={S.secTitle}>Your <span style={{ color: COLORS.lime }}>Stack</span></div>
          <p style={S.secDesc}>Curated for fat loss, work stress, and gym performance. No fluff.</p>

          {[1, 2].map(tier => (
            <div key={tier}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, margin: "20px 0 10px" }}>
                {tier === 1 ? "🥇 Tier 1 — Non-Negotiable" : "🥈 Tier 2 — High Value"}
              </div>
              {SUPPS.filter(s => s.tier === tier).map((s, i) => (
                <div key={i} style={{ ...S.card, borderLeft: `3px solid ${tier === 1 ? COLORS.lime : COLORS.blue}` }}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 900, fontSize: 17, textTransform: "uppercase", marginBottom: 6 }}>{s.name}</div>
                    <span style={S.badge(tier === 1 ? COLORS.lime : COLORS.blue)}>{s.dose}</span>
                    <p style={{ color: "#aaa", fontSize: 13, marginTop: 8 }}>{s.desc}</p>
                    {s.buy && <p style={{ fontSize: 12, marginTop: 6, color: COLORS.limeDim }}>🛒 {s.buy}</p>}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.muted, margin: "20px 0 10px" }}>🥉 Tier 3 — Skip for Now</div>
          <div style={{ ...S.card, opacity: 0.6, borderLeft: `3px solid ${COLORS.border}` }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 900, fontSize: 17, textTransform: "uppercase", marginBottom: 6 }}>Pre-Workout / BCAAs / Fat Burners</div>
              <p style={{ color: "#aaa", fontSize: 13 }}>Coffee covers pre-workout. BCAAs are redundant if you hit protein targets. Fat burners are pure marketing — skip entirely.</p>
            </div>
          </div>

          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, margin: "24px 0 12px" }}>⏰ Daily Routine</div>
          {ROUTINE.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <span style={{ color: COLORS.lime, fontWeight: 700, width: 80, flexShrink: 0 }}>{r.time}</span>
              <span style={{ color: "#ccc" }}>{r.action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Gym */}
      {tab === "gym" && (
        <div style={S.section}>
          <div style={S.secTitle}>Gym <span style={{ color: COLORS.lime }}>Program</span></div>
          <p style={S.secDesc}>3x/week full body · ~50 min/session · Mon / Wed / Fri · Add 2.5kg when top reps feel easy 2 sessions in a row</p>
          {GYM.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} type="gym" />)}
        </div>
      )}

      {/* Home */}
      {tab === "home" && (
        <div style={S.section}>
          <div style={{ ...S.panel, textAlign: "center", marginBottom: 16, borderColor: COLORS.lime }}>
            <div style={{ fontWeight: 900, fontSize: 20, textTransform: "uppercase", color: COLORS.lime }}>10-Min Home Circuit</div>
            <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>2 rounds · No equipment · Any small space</p>
          </div>
          <Timer />
          <div style={{ marginTop: 28 }}>
            <div style={S.secTitle}>Exercise <span style={{ color: COLORS.lime }}>Guide</span></div>
            <p style={S.secDesc}>How to do each movement</p>
            {HOME.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} type="home" />)}
          </div>
        </div>
      )}

      {/* Schedule */}
      {tab === "schedule" && (
        <div style={S.section}>
          <div style={S.secTitle}>Weekly <span style={{ color: COLORS.lime }}>Plan</span></div>
          <p style={S.secDesc}>Balanced structure for consistent fat loss without burnout.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {SCHEDULE.map((d, i) => {
              const colors = { gym: COLORS.lime, home: COLORS.blue, walk: COLORS.orange, rest: COLORS.muted };
              const c = colors[d.type];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${c}`, borderRadius: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: 15, textTransform: "uppercase", width: 36, color: c }}>{d.day}</span>
                  <span style={{ flex: 1, fontSize: 14 }}>{d.label}</span>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                </div>
              );
            })}
          </div>

          <div style={S.panel}>
            <div style={{ fontWeight: 900, fontSize: 18, textTransform: "uppercase", marginBottom: 12 }}>Fat Loss <span style={{ color: COLORS.lime }}>Rules</span></div>
            {[
              ["Target", "0.5–1 kg/week weight loss — sustainable & muscle-preserving"],
              ["Protein", "1.6–2g per kg of bodyweight daily from food + powder"],
              ["Track", "Calories in MyFitnessPal or Cronometer for 2–3 weeks"],
              ["Sleep", "7–9 hours. Non-negotiable for fat loss and stress"],
              ["Overload", "Add 2.5kg when top reps feel easy for 2 sessions in a row"],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: COLORS.lime, fontWeight: 700, width: 70, flexShrink: 0 }}>{k}</span>
                <span style={{ color: "#aaa" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracker */}
      {tab === "tracker" && (
        <div style={S.section}>
          <div style={S.secTitle}>Progress <span style={{ color: COLORS.lime }}>Tracker</span></div>
          <p style={S.secDesc}>Log weekly. Same day, same time, post-toilet for accuracy.</p>
          <Tracker />
        </div>
      )}
    </div>
  );
}
