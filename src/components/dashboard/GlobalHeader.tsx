import { useTheme } from "next-themes";
import { Sun, Moon, Wifi, Clock, Users, User, TableProperties, TrendingUp, TrendingDown, ArrowRight, ChefHat, Timer } from "lucide-react";
import { globalStats, servers } from "@/data/mockData";

/* ── Theme toggle ──────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-primary/40 hover:shadow-[var(--shadow-amber)] hover:text-primary"
      aria-label="Basculer le thème"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/* ── Mini sparkline bars ───────────────────────────────────── */
function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-[2px] h-6">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1 rounded-sm transition-all"
          style={{
            height: `${Math.max(15, (v / max) * 100)}%`,
            background: color,
            opacity: i === values.length - 1 ? 1 : 0.35 + (i / values.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ── Occupancy ring ────────────────────────────────────────── */
function OccupancyRing({ value, total, color }: { value: number; total: number; color: string }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = (value / total) * circ;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="3.5" />
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={circ / 4}
      />
      <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill={color}>
        {Math.round((value / total) * 100)}
      </text>
    </svg>
  );
}

/* ── Wait time arc ─────────────────────────────────────────── */
function WaitArc({ minutes, max = 10, color }: { minutes: number; max?: number; color: string }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(1, minutes / max) * circ;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="3.5" />
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={circ / 4}
      />
    </svg>
  );
}

/* ── Stat card ─────────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: string;
  visual?: React.ReactNode;
  trend?: { direction: "up" | "down"; label: string; good?: boolean };
  accent?: string; // hsl variable name like "primary" | "success" | "danger"
  wide?: boolean;
}

function StatCard({ icon: Icon, label, value, sub, visual, trend, accent = "foreground", wide }: StatCardProps) {
  const accentColor =
    accent === "primary" ? "hsl(var(--primary))"
    : accent === "success" ? "hsl(var(--success))"
    : accent === "danger"  ? "hsl(var(--danger))"
    : accent === "warning" ? "hsl(var(--warning))"
    : "hsl(var(--foreground))";

  const accentBg =
    accent === "primary" ? "bg-primary/8 border-primary/20"
    : accent === "success" ? "bg-[hsl(var(--success-dim))] border-[hsl(var(--success)/0.2)]"
    : accent === "danger"  ? "bg-[hsl(var(--danger-dim))] border-[hsl(var(--danger)/0.2)]"
    : accent === "warning" ? "bg-[hsl(var(--warning-dim))] border-[hsl(var(--warning)/0.2)]"
    : "bg-surface border-border";

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border px-5 py-4 shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5 ${accentBg} ${wide ? "min-w-[180px]" : "min-w-[150px]"}`}
    >
      {/* Label + icon row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `${accentColor}18` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              trend.good === false
                ? "bg-[hsl(var(--danger-dim))] text-[hsl(var(--danger))]"
                : "bg-[hsl(var(--success-dim))] text-[hsl(var(--success))]"
            }`}
          >
            {trend.direction === "up"
              ? <TrendingUp className="h-2.5 w-2.5" />
              : <TrendingDown className="h-2.5 w-2.5" />}
            {trend.label}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black font-mono leading-none" style={{ color: accentColor }}>
            {value}
          </div>
          {sub && (
            <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">{sub}</p>
          )}
        </div>
        {visual && <div className="shrink-0">{visual}</div>}
      </div>
    </div>
  );
}

/* ── Service duration display ──────────────────────────────── */
function ServiceTimer({ start, current }: { start: string; current: string }) {
  const [sh, sm] = start.split(":").map(Number);
  const [ch, cm] = current.split(":").map(Number);
  const totalMin = (ch * 60 + cm) - (sh * 60 + sm);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  return (
    <div className="flex flex-col items-end gap-2 rounded-2xl border border-border bg-surface px-5 py-4 shadow-[var(--shadow-xs)] shrink-0">
      <div className="flex items-center gap-2">
        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Durée du service</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black font-mono text-foreground">{h}h{String(m).padStart(2, "0")}</span>
        <span className="text-[10px] text-muted-foreground">depuis {start}</span>
      </div>
      {/* Progress bar — 6h max shift */}
      <div className="w-full h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-amber"
          style={{ width: `${Math.min(100, (totalMin / 360) * 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ── Main header ───────────────────────────────────────────── */
export function GlobalHeader() {
  const s = globalStats;

  // Derive quick stats
  const avgScore = Math.round(servers.reduce((a, b) => a + b.score, 0) / servers.length);
  const alertCount = servers.reduce((a, b) => a + b.alerts.length, 0);
  const sparkData = [55, 62, 71, 68, 74, 78, 82, avgScore]; // simulated history

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-xl shadow-[var(--shadow-xs)]">
      {/* ── Brand bar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/60">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-amber shadow-amber">
            <ChefHat className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-black text-foreground tracking-tight">The Kitchen</h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Dashboard Efficacité Serveurs</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success-dim))] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse-success" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--success))]">En direct</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            <span className="text-xs text-muted-foreground">6 caméras actives</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/8 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{s.currentTime}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="flex items-stretch gap-3 overflow-x-auto px-6 py-4 scrollbar-none">

        {/* Serveurs actifs */}
        <StatCard
          icon={User}
          label="Serveurs actifs"
          value={s.activeServers}
          sub={`${servers.filter(s => s.alerts.length === 0).length} sans alerte`}
          accent="primary"
          visual={
            <div className="flex flex-col gap-1 items-end">
              {servers.map((srv) => (
                <div key={srv.id} className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-muted-foreground">{srv.name.split(" ")[0]}</span>
                  <div
                    className="h-2 w-2 rounded-full border border-white/20"
                    style={{ background: srv.color }}
                  />
                </div>
              ))}
            </div>
          }
          trend={{ direction: "up", label: "+0", good: true }}
        />

        {/* Score moyen */}
        <StatCard
          icon={TrendingUp}
          label="Score moyen"
          value={`${avgScore}`}
          sub="efficacité globale"
          accent={avgScore >= 70 ? "success" : avgScore >= 40 ? "warning" : "danger"}
          visual={
            <MiniSpark
              values={sparkData}
              color={avgScore >= 70 ? "hsl(var(--success))" : avgScore >= 40 ? "hsl(var(--warning))" : "hsl(var(--danger))"}
            />
          }
          trend={{ direction: "up", label: "+4pts", good: true }}
        />

        {/* Clients présents */}
        <StatCard
          icon={Users}
          label="Clients présents"
          value={s.totalClients}
          sub="dans la salle"
          accent="foreground"
          visual={
            <div className="flex flex-col gap-1 w-20">
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>Capacité</span><span>60</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-amber"
                  style={{ width: `${(s.totalClients / 60) * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-muted-foreground text-right">
                {Math.round((s.totalClients / 60) * 100)}% rempli
              </div>
            </div>
          }
        />

        {/* Tables occupées */}
        <StatCard
          icon={TableProperties}
          label="Tables occupées"
          value={`${s.tablesOccupied}/${s.totalTables}`}
          sub={`${s.totalTables - s.tablesOccupied} tables libres`}
          accent="foreground"
          visual={
            <OccupancyRing
              value={s.tablesOccupied}
              total={s.totalTables}
              color="hsl(var(--primary))"
            />
          }
        />

        {/* Attente moyenne */}
        <StatCard
          icon={Clock}
          label="Attente moyenne"
          value={
            <span>
              {s.avgWaitTime}
              <span className="text-sm font-semibold ml-1" style={{ color: s.avgWaitTime > 5 ? "hsl(var(--danger))" : "hsl(var(--success))" }}>
                min
              </span>
            </span>
          }
          sub={
            s.avgWaitTime < 2 ? "Excellent · &lt; 2 min"
            : s.avgWaitTime < 5 ? "Bon · 2–5 min"
            : "À améliorer · &gt; 5 min"
          }
          accent={s.avgWaitTime > 5 ? "danger" : s.avgWaitTime > 2 ? "success" : "success"}
          visual={
            <WaitArc
              minutes={s.avgWaitTime}
              color={s.avgWaitTime > 5 ? "hsl(var(--danger))" : "hsl(var(--success))"}
            />
          }
          trend={{
            direction: "down",
            label: "-0.3",
            good: true,
          }}
          wide
        />

        {/* Alertes actives */}
        <StatCard
          icon={alertCount > 0 ? ArrowRight : ArrowRight}
          label="Alertes actives"
          value={alertCount}
          sub={`${servers.reduce((a,b) => a + b.alerts.filter(x=>x.type==="critical").length, 0)} critiques`}
          accent={alertCount > 2 ? "danger" : alertCount > 0 ? "warning" : "success"}
          trend={alertCount > 0 ? { direction: "up", label: `${alertCount}`, good: false } : { direction: "down", label: "0", good: true }}
        />

        {/* Séparateur */}
        <div className="mx-1 w-px self-stretch bg-border shrink-0" />

        {/* Service timer */}
        <ServiceTimer start={s.serviceStart} current={s.currentTime} />
      </div>
    </header>
  );
}
