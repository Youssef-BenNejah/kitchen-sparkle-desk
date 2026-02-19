import { useTheme } from "next-themes";
import { Sun, Moon, Wifi, Clock, Users, User, TableProperties } from "lucide-react";
import { globalStats } from "@/data/mockData";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-primary/40 hover:shadow-[var(--shadow-amber)] hover:text-primary"
      aria-label="Basculer le thème"
    >
      {isDark
        ? <Sun className="h-4 w-4" />
        : <Moon className="h-4 w-4" />}
    </button>
  );
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: "amber" | "success" | "danger" | "default";
}

function StatPill({ icon, label, value, unit, color = "default" }: StatPillProps) {
  const colorMap = {
    amber:   "bg-primary/8 border-primary/20 text-primary",
    success: "bg-[hsl(var(--success-dim))] border-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]",
    danger:  "bg-[hsl(var(--danger-dim))]  border-[hsl(var(--danger)/0.2)]  text-[hsl(var(--danger))]",
    default: "bg-surface border-border text-foreground",
  };

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] ${colorMap[color]}`}>
      <div className="opacity-70 shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-xl font-bold font-mono leading-none mt-0.5">
          {value}
          {unit && <span className="text-xs font-medium opacity-50 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export function GlobalHeader() {
  const s = globalStats;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-xl shadow-[var(--shadow-xs)]">
      {/* Brand bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/60">
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-amber shadow-amber">
            <span className="text-[10px] font-black text-primary-foreground tracking-tight">TK</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">The Kitchen</h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Dashboard Efficacité Serveurs</p>
          </div>
          <div className="ml-2 flex items-center gap-1.5 rounded-full border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success-dim))] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse-success" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--success))]">En direct</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-1.5">
            <Wifi className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            <span className="text-xs text-muted-foreground">6 caméras</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/8 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{s.currentTime}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 overflow-x-auto px-6 py-3 scrollbar-none">
        <StatPill
          icon={<User className="h-4.5 w-4.5" />}
          label="Serveurs actifs"
          value={s.activeServers}
          color="amber"
        />
        <StatPill
          icon={<Users className="h-4.5 w-4.5" />}
          label="Clients présents"
          value={s.totalClients}
        />
        <StatPill
          icon={<TableProperties className="h-4.5 w-4.5" />}
          label="Tables occupées"
          value={`${s.tablesOccupied}/${s.totalTables}`}
        />
        <StatPill
          icon={<Clock className="h-4.5 w-4.5" />}
          label="Attente moyenne"
          value={s.avgWaitTime}
          unit="min"
          color={s.avgWaitTime > 5 ? "danger" : "success"}
        />
        <div className="ml-auto shrink-0 flex items-center gap-2 rounded-2xl border border-border bg-surface-raised px-4 py-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Service depuis</span>
          <span className="font-mono text-sm font-bold text-foreground">{s.serviceStart}</span>
        </div>
      </div>
    </header>
  );
}
