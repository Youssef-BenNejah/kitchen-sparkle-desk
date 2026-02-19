import { Users, User, Clock, TableProperties, Wifi } from "lucide-react";
import { globalStats } from "@/data/mockData";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

function StatCard({ icon, label, value, sub, highlight }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl px-5 py-4 border transition-all ${
        highlight
          ? "border-primary/30 bg-primary/5 glow-amber"
          : "border-border bg-surface"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          highlight ? "bg-primary/20 text-primary" : "bg-surface-raised text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-bold leading-tight font-mono ${highlight ? "text-primary" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function GlobalHeader() {
  const s = globalStats;

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse-red" style={{ animationName: "pulse-green" }} />
            <span className="text-xs font-semibold text-success uppercase tracking-widest">Live</span>
          </div>
          <span className="text-border">|</span>
          <span className="text-sm font-bold text-foreground tracking-wide">The Kitchen</span>
          <span className="text-border">·</span>
          <span className="text-xs text-muted-foreground">Dashboard Efficacité Serveurs</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wifi className="h-3.5 w-3.5 text-success" />
            <span>6 caméras actives</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">{s.currentTime}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 px-6 py-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={<User className="h-5 w-5" />}
          label="Serveurs actifs"
          value={s.activeServers}
          highlight
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Clients présents"
          value={s.totalClients}
          sub="dans la salle"
        />
        <StatCard
          icon={<TableProperties className="h-5 w-5" />}
          label="Tables occupées"
          value={`${s.tablesOccupied}/${s.totalTables}`}
          sub={`${Math.round((s.tablesOccupied / s.totalTables) * 100)}% d'occupation`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Attente moyenne"
          value={`${s.avgWaitTime} min`}
          sub="avant première visite"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Début du service"
          value={s.serviceStart}
          sub="service en cours"
        />
      </div>
    </header>
  );
}
