import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Sun, Moon, Wifi, Clock, Users, User, TableProperties,
  TrendingUp, TrendingDown, ArrowRight, ChefHat, Timer, Menu, X,
} from "lucide-react";
import { globalStats, servers } from "@/data/mockData";

/* ── Theme toggle ──────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-primary/40 hover:text-primary shrink-0"
      aria-label="Basculer le thème"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/* ── Mini sparkline ────────────────────────────────────────── */
function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-[2px] h-5">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${Math.max(15, (v / max) * 100)}%`,
            background: color,
            opacity: 0.3 + (i / values.length) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* ── Occupancy ring ────────────────────────────────────────── */
function OccupancyRing({ value, total, color }: { value: number; total: number; color: string }) {
  const r = 12;
  const circ = 2 * Math.PI * r;
  const filled = (value / total) * circ;
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0">
      <circle cx="15" cy="15" r={r} fill="none" stroke={color} strokeOpacity="0.15" strokeWidth="3" />
      <circle
        cx="15" cy="15" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={circ / 4}
      />
      <text x="15" y="19" textAnchor="middle" fontSize="7.5" fontWeight="800" fontFamily="JetBrains Mono,monospace" fill={color}>
        {Math.round((value / total) * 100)}
      </text>
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
  accent?: string;
}

function StatCard({ icon: Icon, label, value, sub, visual, trend, accent = "default" }: StatCardProps) {
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
    <div className={`flex flex-col gap-2 rounded-xl border p-3.5 shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5 ${accentBg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: `${accentColor}18` }}>
            <Icon className="h-3 w-3" style={{ color: accentColor }} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">{label}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
            trend.good === false
              ? "bg-[hsl(var(--danger-dim))] text-[hsl(var(--danger))]"
              : "bg-[hsl(var(--success-dim))] text-[hsl(var(--success))]"
          }`}>
            {trend.direction === "up" ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
            {trend.label}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xl font-black font-mono leading-none" style={{ color: accentColor }}>
            {value}
          </div>
          {sub && <p className="text-[9px] text-muted-foreground mt-1 leading-snug truncate">{sub}</p>}
        </div>
        {visual && <div className="shrink-0">{visual}</div>}
      </div>
    </div>
  );
}

/* ── Service timer ─────────────────────────────────────────── */
function ServiceTimer({ start, current }: { start: string; current: string }) {
  const [sh, sm] = start.split(":").map(Number);
  const [ch, cm] = current.split(":").map(Number);
  const totalMin = (ch * 60 + cm) - (sh * 60 + sm);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-3.5 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-1.5">
        <Timer className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Durée service</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black font-mono text-foreground">{h}h{String(m).padStart(2, "0")}</span>
        <span className="text-[9px] text-muted-foreground">depuis {start}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full bg-gradient-amber" style={{ width: `${Math.min(100, (totalMin / 360) * 100)}%` }} />
      </div>
    </div>
  );
}

/* ── Main header ───────────────────────────────────────────── */
export function GlobalHeader() {
  const s = globalStats;
  const [mobileStatsOpen, setMobileStatsOpen] = useState(false);

  const avgScore = Math.round(servers.reduce((a, b) => a + b.score, 0) / servers.length);
  const alertCount = servers.reduce((a, b) => a + b.alerts.length, 0);
  const sparkData = [55, 62, 71, 68, 74, 78, 82, avgScore];

  const statsContent = (
    <>
      <StatCard
        icon={User} label="Serveurs actifs" value={s.activeServers}
        sub={`${servers.filter(s => s.alerts.length === 0).length} sans alerte`}
        accent="primary"
        visual={
          <div className="flex gap-1 items-end">
            {servers.map((srv) => (
              <div key={srv.id} className="h-2 w-2 rounded-full" style={{ background: srv.color }} />
            ))}
          </div>
        }
        trend={{ direction: "up", label: "+0", good: true }}
      />
      <StatCard
        icon={TrendingUp} label="Score moyen" value={`${avgScore}`}
        sub="efficacité globale"
        accent={avgScore >= 70 ? "success" : avgScore >= 40 ? "warning" : "danger"}
        visual={
          <MiniSpark
            values={sparkData}
            color={avgScore >= 70 ? "hsl(var(--success))" : "hsl(var(--warning))"}
          />
        }
        trend={{ direction: "up", label: "+4pts", good: true }}
      />
      <StatCard
        icon={Users} label="Clients présents" value={s.totalClients}
        sub={`${Math.round((s.totalClients / 60) * 100)}% capacité`}
        accent="default"
        visual={
          <div className="w-14">
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-gradient-amber" style={{ width: `${(s.totalClients / 60) * 100}%` }} />
            </div>
          </div>
        }
      />
      <StatCard
        icon={TableProperties} label="Tables occupées" value={`${s.tablesOccupied}/${s.totalTables}`}
        sub={`${s.totalTables - s.tablesOccupied} libres`}
        accent="default"
        visual={<OccupancyRing value={s.tablesOccupied} total={s.totalTables} color="hsl(var(--primary))" />}
      />
      <StatCard
        icon={Clock} label="Attente moyenne"
        value={
          <span>
            {s.avgWaitTime}
            <span className="text-sm font-semibold ml-1" style={{ color: s.avgWaitTime > 5 ? "hsl(var(--danger))" : "hsl(var(--success))" }}>
              min
            </span>
          </span>
        }
        sub={s.avgWaitTime < 2 ? "Excellent" : s.avgWaitTime < 5 ? "Bon · 2–5 min" : "À améliorer"}
        accent={s.avgWaitTime > 5 ? "danger" : "success"}
        trend={{ direction: "down", label: "-0.3", good: true }}
      />
      <StatCard
        icon={ArrowRight} label="Alertes actives" value={alertCount}
        sub={`${servers.reduce((a, b) => a + b.alerts.filter(x => x.type === "critical").length, 0)} critiques`}
        accent={alertCount > 2 ? "danger" : alertCount > 0 ? "warning" : "success"}
        trend={alertCount > 0 ? { direction: "up", label: `${alertCount}`, good: false } : { direction: "down", label: "0", good: true }}
      />
      <ServiceTimer start={s.serviceStart} current={s.currentTime} />
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-xl shadow-[var(--shadow-xs)]">
      {/* ── Brand bar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/60">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          {/* Logo */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-amber shadow-amber">
            <ChefHat className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-foreground tracking-tight">The Kitchen</h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">Dashboard Efficacité Serveurs</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success-dim))] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse-success" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--success))]">En direct</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live dot on mobile only */}
          <span className="sm:hidden h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse-success" />

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            <span className="text-xs text-muted-foreground">6 caméras</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/8 px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{s.currentTime}</span>
          </div>

          <ThemeToggle />

          {/* Mobile stats toggle */}
          <button
            onClick={() => setMobileStatsOpen(!mobileStatsOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground shadow-[var(--shadow-xs)] transition-colors hover:text-foreground"
            aria-label="Afficher les statistiques"
          >
            {mobileStatsOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Stats — Desktop: scrollable row, Mobile: collapsible grid ── */}

      {/* Desktop row */}
      <div className="hidden md:flex items-stretch gap-3 overflow-x-auto px-6 py-4 scrollbar-none">
        {statsContent}
      </div>

      {/* Mobile expandable grid */}
      {mobileStatsOpen && (
        <div className="md:hidden grid grid-cols-2 gap-2 px-4 py-4 border-t border-border bg-surface-raised animate-fade-up">
          {statsContent}
        </div>
      )}

      {/* Mobile compact summary bar (always visible) */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-t border-border/40 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <User className="h-3 w-3 text-primary" />
          <span className="text-xs font-bold font-mono text-primary">{s.activeServers}</span>
          <span className="text-[10px] text-muted-foreground">serveurs</span>
        </div>
        <span className="text-border shrink-0">·</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-bold font-mono text-foreground">{s.totalClients}</span>
          <span className="text-[10px] text-muted-foreground">clients</span>
        </div>
        <span className="text-border shrink-0">·</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <TableProperties className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-bold font-mono text-foreground">{s.tablesOccupied}/{s.totalTables}</span>
          <span className="text-[10px] text-muted-foreground">tables</span>
        </div>
        <span className="text-border shrink-0">·</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="h-3 w-3 text-[hsl(var(--success))]" />
          <span className="text-xs font-bold font-mono text-[hsl(var(--success))]">{s.avgWaitTime}min</span>
          <span className="text-[10px] text-muted-foreground">attente</span>
        </div>
        {alertCount > 0 && (
          <>
            <span className="text-border shrink-0">·</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--danger))] animate-pulse-danger" />
              <span className="text-xs font-bold font-mono text-[hsl(var(--danger))]">{alertCount}</span>
              <span className="text-[10px] text-muted-foreground">alertes</span>
            </div>
          </>
        )}
        <button
          onClick={() => setMobileStatsOpen(!mobileStatsOpen)}
          className="ml-auto shrink-0 flex items-center gap-1 text-[10px] font-semibold text-primary"
        >
          {mobileStatsOpen ? "Réduire" : "Détails"}
          <TrendingUp className="h-2.5 w-2.5" />
        </button>
      </div>
    </header>
  );
}
