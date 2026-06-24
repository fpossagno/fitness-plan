import { useState, useEffect, useRef } from "react";

const COLORS = {
  black: "#0a0a0a", charcoal: "#161616", panel: "#1e1e1e", border: "#2e2e2e",
  lime: "#c8f135", limeDim: "#8aaa22", white: "#f0f0eb", muted: "#777",
  blue: "#4a9eff", orange: "#f5a623", red: "#e84040",
};

const GYM = [
  { name: "Goblet Squat / Leg Press", sets: "3 × 12", muscle: "Quads + Glutes", tip: "Keep chest up, drive through heels", img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=700&q=80", emoji: "🦵" },
  { name: "Romanian Deadlift", sets: "3 × 10", muscle: "Hamstrings + Lower Back", tip: "Hinge at hips, bar close to legs, slight knee bend", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80", emoji: "🏋️" },
  { name: "Chest Press", sets: "3 × 12", muscle: "Chest + Triceps", tip: "Full range, controlled descent, elbows at 45°", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80", emoji: "💪" },
  { name: "Cable / Seated Row", sets: "3 × 12", muscle: "Back + Biceps", tip: "Pull elbows back, squeeze shoulder blades at peak", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=700&q=80", emoji: "🔙" },
  { name: "Shoulder Press", sets: "3 × 10", muscle: "Shoulders", tip: "Don't fully lock out at top, steady controlled tempo", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80", emoji: "🙆" },
  { name: "Lat Pulldown", sets: "3 × 12", muscle: "Lats + Upper Back", tip: "Pull bar to upper chest, lean back slightly", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80", emoji: "⬇️" },
  { name: "Plank", sets: "3 × 40 sec", muscle: "Core + Stability", tip: "Hips level, breathe steadily, don't hold breath", img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=700&q=80", emoji: "⬜" },
  { name: "Incline Treadmill Walk", sets: "10 min", muscle: "Cardio + Fat Burn", tip: "Incline 8–12%, 5–6 km/h, don't hold the rails", img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=700&q=80", emoji: "🚶" },
];

const HOME = [
  { name: "Jumping Jacks", dur: 40, muscle: "Full body warm-up", tip: "Controlled rhythm, land softly on balls of feet", img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=700&q=80", emoji: "⭐" },
  { name: "Bodyweight Squats", dur: 40, muscle: "Quads + Glutes", tip: "Feet shoulder-width, chest up, sit back into it", img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&q=80", emoji: "🦵" },
  { name: "Same-Side Knee to Elbow", dur: 40, muscle: "Obliques + Balance", tip: "Standing — lift right knee while right elbow comes down. Slow and controlled.", img: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=700&q=80", emoji: "🔄" },
  { name: "Opposite Knee Raises", dur: 40, muscle: "Core + Hip Flexors", tip: "Lift left knee while twisting right elbow toward it. Standing crunch.", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=80", emoji: "🔃" },
  { name: "Push-Ups", dur: 40, muscle: "Chest + Triceps", tip: "On knees if needed. Full chest to floor, arms at 45°", img: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=700&q=80", emoji: "💪" },
  { name: "Reverse Lunges", dur: 40, muscle: "Glutes + Quads", tip: "Step back, not forward. Keep front knee over ankle.", img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&q=80", emoji: "🦶" },
  { name: "High Knees", dur: 40, muscle: "Cardio + Core", tip: "Drive knees to hip height, pump arms, stay on toes", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80", emoji: "🏃" },
  { name: "Glute Bridges", dur: 40, muscle: "Glutes + Lower Back", tip: "Lie on floor, feet flat. Drive hips up and squeeze at top.", img: "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=700&q=80", emoji: "🌉" },
  { name: "Mountain Climbers", dur: 40, muscle: "Core + Cardio", tip: "Plank position — drive knees alternately to chest. Keep hips level.", img: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=700&q=80", emoji: "🏔️" },
  { name: "Deep Breath Stretch", dur: 20, muscle: "Recovery", tip: "Hands overhead, inhale deeply for 4 counts, exhale for 4", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80", emoji: "🧘" },
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

const MEALS = [
  {
    time: "7:00", label: "Breakfast", kcal: 450, protein: 35,
    options: [
      { name: "Scrambled eggs + rye bread + avocado", detail: "3 eggs scrambled · 2 slices rye bread · half avocado · black coffee" },
      { name: "Greek yogurt bowl", detail: "200g Greek yogurt 0% · 40g oats · handful berries · 1 tbsp honey · optional whey scoop" },
      { name: "Overnight oats + boiled eggs", detail: "80g oats · 200ml milk · 2 boiled eggs · piece of fruit" },
    ]
  },
  {
    time: "12:30", label: "Lunch", kcal: 600, protein: 45,
    options: [
      { name: "Chicken rice bowl", detail: "150g grilled chicken breast · 120g cooked rice · roasted vegetables · olive oil and lemon dressing" },
      { name: "Salmon salad", detail: "150g baked salmon · large mixed salad · 80g quinoa · olive oil" },
      { name: "Turkey wrap", detail: "2 wholegrain wraps · 130g sliced turkey · hummus · lettuce · tomato · cucumber" },
    ]
  },
  {
    time: "15:30", label: "Snack (optional)", kcal: 200, protein: 20,
    options: [
      { name: "Protein shake + banana", detail: "1 scoop whey (25g protein) · 1 banana · water" },
      { name: "Cottage cheese + fruit", detail: "200g cottage cheese · handful of grapes or berries" },
      { name: "Rice cakes + peanut butter", detail: "3 rice cakes · 2 tbsp peanut butter · black coffee" },
    ]
  },
  {
    time: "19:00", label: "Dinner", kcal: 650, protein: 45,
    options: [
      { name: "Beef stir-fry + noodles", detail: "150g lean beef strips · 100g soba noodles · broccoli and peppers · soy and ginger sauce" },
      { name: "Baked cod + sweet potato", detail: "180g cod fillet · 200g sweet potato mash · steamed greens · olive oil" },
      { name: "Chicken pasta", detail: "130g chicken breast · 80g dry pasta · tomato sauce · parmesan · side salad" },
    ]
  },
];

const RULES = [
  { icon: "🎯", label: "Daily calories", value: "1,900–2,000 kcal (500 kcal deficit from your maintenance)" },
  { icon: "💪", label: "Protein target", value: "140–160g per day — hit this above everything else" },
  { icon: "💧", label: "Water", value: "2.5–3L daily — more on gym days" },
  { icon: "🚫", label: "Avoid", value: "Sugary drinks, alcohol on weekdays, ultra-processed snacks" },
  { icon: "✅", label: "Prioritise", value: "Protein first at every meal, vegetables at lunch and dinner" },
  { icon: "⏰", label: "Timing", value: "Eat within 1h of waking. Don't skip meals — it spikes cortisol" },
];

const GROCERY = [
  { cat: "Protein", items: ["Chicken breast", "Salmon fillet", "Lean beef mince", "Cod / white fish", "Turkey slices", "Eggs (12-pack)", "Greek yogurt 0%", "Cottage cheese", "Whey protein"] },
  { cat: "Carbs", items: ["Rye bread", "Oats", "Brown rice", "Sweet potato", "Wholegrain pasta", "Quinoa", "Rice cakes"] },
  { cat: "Fats", items: ["Avocado", "Olive oil", "Peanut butter (no sugar)", "Mixed nuts"] },
  { cat: "Veg & Fruit", items: ["Broccoli", "Spinach", "Mixed peppers", "Cucumber", "Tomatoes", "Berries (frozen ok)", "Banana", "Apples"] },
  { cat: "Flavour", items: ["Garlic", "Lemon", "Soy sauce (low sodium)", "Ginger", "Cumin", "Paprika", "Hummus"] },
];

const S = {
  page: { background: COLORS.black, minHeight: "100vh", color: COLORS.white, fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 14 },
  header: { background: COLORS.charcoal, borderBottom: "2px solid " + COLORS.lime, padding: "28px 20px 20px", textAlign: "center" },
  eyebrow: { fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLORS.lime, marginBottom: 8 },
  h1: { fontSize: "clamp(38px, 9vw, 64px)", fontWeight: 900, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1, margin: 0 },
  subtitle: { marginTop: 8, color: COLORS.muted, fontSize: 13, fontWeight: 300 },
  nav: { display: "flex", overflowX: "auto", background: COLORS.charcoal, borderBottom: "1px solid " + COLORS.border, position: "sticky", top: 0, zIndex: 100 },
  navBtn: (active) => ({ flex: "0 0 auto", padding: "13px 16px", background: "none", border: "none", borderBottom: "3px solid " + (active ? COLORS.lime : "transparent"), color: active ? COLORS.lime : COLORS.muted, fontFamily: "system-ui", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }),
  section: { padding: "20px 16px 60px", maxWidth: 680, margin: "0 auto" },
  secTitle: { fontSize: 28, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  secDesc: { color: COLORS.muted, fontSize: 13, marginBottom: 20 },
  card: { background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 10, overflow: "hidden", marginBottom: 14 },
  panel: { background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 16 },
  badge: (color) => ({ display: "inline-block", background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3, marginRight: 6 }),
};

function ExerciseCard({ ex, index, type }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={S.card}>
      {!imgErr ? (
        <img src={ex.img} alt={ex.name} onError={() => setImgErr(true)}
          style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", height: 190, background: "linear-gradient(135deg,#1a2a1a,#2a3a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
          {ex.emoji}
        </div>
      )}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontWeight: 900, fontSize: 18, textTransform: "uppercase", marginBottom: 6 }}>{index + 1}. {ex.name}</div>
        <div style={{ marginBottom: 8 }}>
          <span style={S.badge(COLORS.lime)}>{type === "gym" ? ex.sets : ex.dur + " sec"}</span>
          <span style={S.badge(COLORS.blue)}>{ex.muscle}</span>
        </div>
        <div style={{ color: "#aaa", fontSize: 13 }}>💡 {ex.tip}</div>
      </div>
    </div>
  );
}

function Timer() {
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const intervalRef = useRef(null);
  const stateRef = useRef({ idx: 0, round: 1, timeLeft: 40, phase: "idle" });

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

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
            stateRef.current = { ...st, timeLeft: 60, phase: "rest" };
            setTimeLeft(60); setPhase("rest");
          } else {
            clearInterval(intervalRef.current);
            setRunning(false); setPhase("done");
            stateRef.current = { ...st, phase: "done" };
          }
        } else {
          const dur = HOME[ni].dur;
          stateRef.current = { ...st, idx: ni, timeLeft: dur, phase: "go" };
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
      stateRef.current = { idx: 0, round: 1, timeLeft: HOME[0].dur, phase: "go" };
      setIdx(0); setRound(1); setTimeLeft(HOME[0].dur); setPhase("go"); setRunning(true);
      intervalRef.current = setInterval(tick, 1000);
    } else if (running) {
      clearInterval(intervalRef.current); setRunning(false);
    } else {
      intervalRef.current = setInterval(tick, 1000); setRunning(true);
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
          const isDone = (phase === "go" && i < idx) || phase === "rest" || phase === "done";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: isCurrent ? "rgba(200,241,53,0.08)" : COLORS.panel, border: "1px solid " + (isCurrent ? COLORS.lime : COLORS.border), borderRadius: 6, opacity: isDone ? 0.35 : 1, transition: "all 0.3s" }}>
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

function NutritionTab() {
  const [activeMeal, setActiveMeal] = useState(null);
  const [mealOptions, setMealOptions] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { label: "Calories", value: "~1,900", unit: "kcal", color: COLORS.lime },
          { label: "Protein", value: "~150g", unit: "/day", color: COLORS.blue },
          { label: "Deficit", value: "~500", unit: "kcal", color: COLORS.orange },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: COLORS.panel, border: "1px solid " + COLORS.border, borderTop: "3px solid " + s.color, borderRadius: 8, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}<span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 400 }}> {s.unit}</span></div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, marginBottom: 12 }}>📋 Daily Meal Plan</div>

      {MEALS.map((meal, mi) => (
        <div key={mi} style={{ background: COLORS.panel, border: "1px solid " + (activeMeal === mi ? COLORS.lime : COLORS.border), borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
          <div onClick={() => setActiveMeal(activeMeal === mi ? null : mi)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ background: COLORS.charcoal, borderRadius: 6, padding: "4px 8px", minWidth: 44, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.lime }}>{meal.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 15, textTransform: "uppercase" }}>{meal.label}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{meal.options[mealOptions[mi]].name}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.lime }}>{meal.kcal} kcal</div>
              <div style={{ fontSize: 11, color: COLORS.blue }}>{meal.protein}g protein</div>
            </div>
            <div style={{ color: COLORS.muted, fontSize: 14, marginLeft: 4 }}>{activeMeal === mi ? "▲" : "▼"}</div>
          </div>

          {activeMeal === mi && (
            <div style={{ borderTop: "1px solid " + COLORS.border, padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {meal.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setMealOptions(p => ({ ...p, [mi]: oi }))}
                    style={{ padding: "5px 12px", borderRadius: 4, border: "1px solid " + (mealOptions[mi] === oi ? COLORS.lime : COLORS.border), background: mealOptions[mi] === oi ? "rgba(200,241,53,0.1)" : "transparent", color: mealOptions[mi] === oi ? COLORS.lime : COLORS.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Option {oi + 1}
                  </button>
                ))}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{meal.options[mealOptions[mi]].name}</div>
              <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.8 }}>
                {meal.options[mealOptions[mi]].detail.split(" · ").map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: COLORS.lime }}>·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, margin: "24px 0 12px" }}>⚡ Key Rules</div>
      {RULES.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid " + COLORS.border, fontSize: 13 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{r.icon}</span>
          <span style={{ color: COLORS.lime, fontWeight: 700, width: 110, flexShrink: 0 }}>{r.label}</span>
          <span style={{ color: "#ccc" }}>{r.value}</span>
        </div>
      ))}

      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, margin: "24px 0 12px" }}>🛒 Weekly Grocery List</div>
      {GROCERY.map((g, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: COLORS.blue, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{g.cat}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {g.items.map((item, j) => (
              <span key={j} style={{ background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 4, padding: "4px 10px", fontSize: 12, color: "#ccc" }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

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
    { key: "weight", label: "⚖️ Weight", unit: "kg", placeholder: "e.g. 85" },
    { key: "waist", label: "📏 Waist", unit: "cm", placeholder: "e.g. 90" },
    { key: "energy", label: "⚡ Energy", unit: "/10", placeholder: "1–10" },
    { key: "sleep", label: "😴 Sleep", unit: "hrs", placeholder: "e.g. 7.5" },
    { key: "stress", label: "🧠 Stress", unit: "/10", placeholder: "1=low 10=high" },
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
              style={{ flex: 1, background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 6, padding: "8px 12px", color: COLORS.white, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <span style={{ color: COLORS.muted, fontSize: 12, width: 32 }}>{f.unit}</span>
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
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 12px", background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: COLORS.muted, width: 80, flexShrink: 0 }}>{e.date}</span>
            <span style={{ fontWeight: 700, width: 60 }}>{e.weight ? e.weight + " kg" : "—"}</span>
            <span style={{ color: COLORS.blue, width: 56 }}>{e.waist ? e.waist + " cm" : "—"}</span>
            <span style={{ color: COLORS.orange, fontSize: 12 }}>⚡{e.energy || "—"} 😴{e.sleep || "—"}h 🧠{e.stress || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: "supplements", label: "💊 Supps" },
  { id: "gym", label: "🏋️ Gym" },
  { id: "home", label: "🏠 Home" },
  { id: "schedule", label: "📅 Week" },
  { id: "nutrition", label: "🥗 Nutrition" },
  { id: "tracker", label: "📈 Track" },
];

export default function App() {
  const [tab, setTab] = useState("supplements");

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.eyebrow}>Personal Fitness Plan</div>
        <h1 style={S.h1}>Train <span style={{ color: COLORS.lime }}>Hard.</span><br />Live Better.</h1>
        <p style={S.subtitle}>Fat loss · Stress relief · Strength · Feel good</p>
      </div>

      <div style={S.nav}>
        {TABS.map(t => (
          <button key={t.id} style={S.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

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
                <div key={i} style={{ ...S.card, borderLeft: "3px solid " + (tier === 1 ? COLORS.lime : COLORS.blue) }}>
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
          <div style={{ ...S.card, opacity: 0.6, borderLeft: "3px solid " + COLORS.border }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 900, fontSize: 17, textTransform: "uppercase", marginBottom: 6 }}>Pre-Workout / BCAAs / Fat Burners</div>
              <p style={{ color: "#aaa", fontSize: 13 }}>Coffee covers pre-workout. BCAAs are redundant if you hit protein targets. Fat burners are pure marketing — skip entirely.</p>
            </div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: COLORS.lime, margin: "24px 0 12px" }}>⏰ Daily Routine</div>
          {ROUTINE.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid " + COLORS.border, fontSize: 13 }}>
              <span style={{ color: COLORS.lime, fontWeight: 700, width: 80, flexShrink: 0 }}>{r.time}</span>
              <span style={{ color: "#ccc" }}>{r.action}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "gym" && (
        <div style={S.section}>
          <div style={S.secTitle}>Gym <span style={{ color: COLORS.lime }}>Program</span></div>
          <p style={S.secDesc}>3x/week full body · ~50 min/session · Mon / Wed / Fri</p>
          {GYM.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} type="gym" />)}
        </div>
      )}

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

      {tab === "schedule" && (
        <div style={S.section}>
          <div style={S.secTitle}>Weekly <span style={{ color: COLORS.lime }}>Plan</span></div>
          <p style={S.secDesc}>Balanced structure for consistent fat loss without burnout.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {SCHEDULE.map((d, i) => {
              const colors = { gym: COLORS.lime, home: COLORS.blue, walk: COLORS.orange, rest: COLORS.muted };
              const c = colors[d.type];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: COLORS.panel, border: "1px solid " + COLORS.border, borderLeft: "3px solid " + c, borderRadius: 8 }}>
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
              ["Target", "0.5–1 kg/week weight loss — sustainable and muscle-preserving"],
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

      {tab === "nutrition" && (
        <div style={S.section}>
          <div style={S.secTitle}>Nutrition <span style={{ color: COLORS.lime }}>Plan</span></div>
          <p style={S.secDesc}>Personalised for ~85kg · fat loss · desk job · 3 meals/day</p>
          <NutritionTab />
        </div>
      )}

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
