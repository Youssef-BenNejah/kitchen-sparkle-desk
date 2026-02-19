import { AlertTriangle, XCircle, Camera, Clock, Zap, Target, TrendingUp, Activity } from "lucide-react";
import type { Server } from "@/data/mockData";

/* ── Circular gauge ──────────────────────────────────────────── */
function CircularGauge({ score }: { score: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  const color =
    score >= 70 ? "hsl(var(--success))"
    : score >= 40 ? "hsl(var(--warning))"
    : "hsl(var(--danger))";

  const bgColor =
    score >= 70 ? "hsl(var(--success-dim))"
    : score >= 40 ? "hsl(var(--warning-dim))"
    : "hsl(var(--danger-dim))";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke={bgColor} strokeWidth="7" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(-90 48 48)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

/* ── Mini metric bar ─────────────────────────────────────────── */
function MetricBar({ label, value, weight, color }: {
  label: string; value: number; weight: string; color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/60">{weight}</span>
          <span className="text-xs font-mono font-semibold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-overlay overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ── Server card ─────────────────────────────────────────────── */
export function ServerCard({ server }: { server: Server }) {
  const scoreColor =
    server.score >= 70 ? "hsl(var(--success))"
    : server.score >= 40 ? "hsl(var(--warning))"
    : "hsl(var(--danger))";

  const scoreLabel =
    server.score >= 70 ? "Excellent"
    : server.score >= 40 ? "À surveiller"
    : "Alerte manager";

  const scoreLabelClass =
    server.score >= 70 ? "badge-success"
    : server.score >= 40 ? "badge-warning"
    : "badge-danger";

  const criticalAlerts = server.alerts.filter((a) => a.type === "critical");
  const warningAlerts  = server.alerts.filter((a) => a.type === "warning");

  const reactivityLabel =
    server.avgResponseTime < 2   ? "Excellent"
    : server.avgResponseTime < 5 ? "Bon"
    : server.avgResponseTime < 10? "Passable"
    : "Insuffisant";

  return (
    <div
      className={`rounded-xl border bg-surface card-shadow flex flex-col gap-0 overflow-hidden animate-fade-in-up transition-all ${
        criticalAlerts.length > 0
          ? "border-danger/30 glow-danger"
          : warningAlerts.length > 0
          ? "border-warning/30"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-raised border-b border-border">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border-2 text-background"
          style={{ background: server.color, borderColor: server.color }}
        >
          {server.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{server.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Camera className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">{server.camera}</span>
            <span className="text-border">·</span>
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{server.serviceDuration}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${scoreLabelClass}`}>
            {scoreLabel}
          </span>
          {criticalAlerts.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-danger">
              <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse-red" />
              {criticalAlerts.length} critique{criticalAlerts.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Score gauge + quick stats */}
      <div className="flex items-center gap-4 px-4 py-4">
        <CircularGauge score={server.score} />
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div>
            <p className="text-xs text-muted-foreground">Vitesse</p>
            <p className="text-sm font-semibold text-foreground">
              {server.speed.toFixed(1)}{" "}
              <span className="text-xs font-normal text-muted-foreground">px/f</span>
              {" "}
              <span
                className={`text-xs font-medium ${
                  server.speedLabel === "Rapide" ? "status-green"
                  : server.speedLabel === "Normal" ? "status-orange"
                  : "status-red"
                }`}
              >
                {server.speedLabel}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Réactivité moy.</p>
            <p className="text-sm font-semibold text-foreground">
              {server.avgResponseTime} min
              {" "}
              <span className={`text-xs font-medium ${
                server.avgResponseTime < 2 ? "status-green"
                : server.avgResponseTime < 5 ? "status-orange"
                : "status-red"
              }`}>
                {reactivityLabel}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tables visitées</p>
            <p className="text-sm font-semibold text-foreground">
              {server.tablesVisited}
              <span className="text-xs font-normal text-muted-foreground">/{server.totalTables}</span>
              {" "}
              <span className="text-xs text-muted-foreground">
                ({Math.round((server.tablesVisited / server.totalTables) * 100)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Temps debout</p>
            <p className="text-sm font-semibold text-foreground">
              {server.standingPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Metric bars */}
      <div className="flex flex-col gap-2.5 px-4 pb-3">
        <MetricBar label="Vitesse de déplacement" value={server.speedScore} weight="×30%" color="hsl(var(--primary))" />
        <MetricBar label="Réactivité clients"     value={server.reactivityScore} weight="×30%" color={scoreColor} />
        <MetricBar label="Couverture des tables"  value={server.coverageScore}   weight="×25%" color="hsl(var(--success))" />
        <MetricBar label="Temps actif debout"     value={server.standingScore}   weight="×15%" color="hsl(217 91% 60%)" />
      </div>

      {/* Supplementary info */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border/50 bg-surface-overlay/40 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Fiabilité reconn. <span className="text-foreground font-mono ml-1">{server.recognitionScore}%</span>
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          {server.lastZone}
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Arrivée {server.arrivalTime}
        </span>
      </div>

      {/* Active alerts */}
      {server.alerts.length > 0 && (
        <div className="border-t border-border/50 divide-y divide-border/30">
          {server.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-2 px-4 py-2 text-xs ${
                alert.type === "critical" ? "bg-danger/8 text-danger" : "bg-warning/8 text-warning"
              }`}
            >
              {alert.type === "critical" ? (
                <XCircle className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="flex-1">{alert.message}</span>
              <span className="font-mono shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
