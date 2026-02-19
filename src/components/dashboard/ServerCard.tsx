import { AlertTriangle, XCircle, Camera, Clock, Zap, MapPin, Activity, TrendingUp, Shield } from "lucide-react";
import type { Server } from "@/data/mockData";

/* ── Gauge circulaire premium ──────────────────────────────── */
function PremiumGauge({ score, color, serverColor }: { score: number; color: string; serverColor: string }) {
  const r = 44;
  const stroke = 8;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;

  const gradId = `gauge-grad-${score}-${serverColor.replace("#", "")}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={serverColor} stopOpacity="1" />
            <stop offset="100%" stopColor={serverColor} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`glow-${score}`}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={serverColor}
          strokeOpacity="0.10"
          strokeWidth={stroke}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75].map((tick) => {
          const angle = ((tick / 100) * 360 - 90) * (Math.PI / 180);
          const x1 = 56 + (r - 3) * Math.cos(angle);
          const y1 = 56 + (r - 3) * Math.sin(angle);
          const x2 = 56 + (r + 3) * Math.cos(angle);
          const y2 = 56 + (r + 3) * Math.sin(angle);
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={serverColor} strokeOpacity="0.25" strokeWidth="1.5" />;
        })}
        {/* Progress arc */}
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${gap}`}
          strokeDashoffset={circumference / 4}
          filter={`url(#glow-${score})`}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black font-mono leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mt-0.5">Score</span>
      </div>
    </div>
  );
}

/* ── Barre de métrique ─────────────────────────────────────── */
function MetricRow({ label, value, weight, barColor }: {
  label: string; value: number; weight: string; barColor: string;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{weight}</span>
          <span className="text-xs font-bold font-mono" style={{ color: barColor }}>{value}</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            boxShadow: `0 0 6px ${barColor}50`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Info chip ─────────────────────────────────────────────── */
function InfoChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-surface-raised border border-border px-2.5 py-1.5">
      <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-[10px] font-bold text-foreground font-mono">{value}</span>
    </div>
  );
}

/* ── Carte serveur principale ──────────────────────────────── */
export function ServerCard({ server, delay = 0 }: { server: Server; delay?: number }) {
  const score = server.score;

  const scoreColor =
    score >= 70 ? "hsl(var(--success))"
    : score >= 40 ? "hsl(var(--warning))"
    : "hsl(var(--danger))";

  const scoreLabelText =
    score >= 70 ? "Excellent"
    : score >= 40 ? "À surveiller"
    : "Alerte manager";

  const scoreLabelClass =
    score >= 70 ? "badge-success"
    : score >= 40 ? "badge-warning"
    : "badge-danger";

  const cardBorderStyle =
    server.alerts.some((a) => a.type === "critical")
      ? `2px solid hsl(var(--danger) / 0.4)`
      : server.alerts.some((a) => a.type === "warning")
      ? `2px solid hsl(var(--warning) / 0.3)`
      : `1px solid hsl(var(--border))`;

  const cardGlow =
    server.alerts.some((a) => a.type === "critical")
      ? "shadow-danger-glow"
      : "";

  const reactivityLabel =
    server.avgResponseTime < 2   ? "Excellent"
    : server.avgResponseTime < 5 ? "Bon"
    : server.avgResponseTime < 10? "Passable"
    : "Insuffisant";

  const reactivityColor =
    server.avgResponseTime < 2   ? "text-success"
    : server.avgResponseTime < 5 ? "text-warning"
    : "text-danger";

  const speedColor =
    server.speedLabel === "Rapide" ? "text-success"
    : server.speedLabel === "Normal" ? "text-warning"
    : "text-danger";

  return (
    <div
      className={`flex flex-col rounded-2xl bg-surface overflow-hidden animate-fade-up transition-all duration-300 hover:translate-y-[-2px] ${cardGlow}`}
      style={{
        border: cardBorderStyle,
        boxShadow: "var(--shadow-md)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Accent bar at top in server color */}
      <div className="h-1 w-full" style={{ background: server.color }} />

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar with glow ring */}
          <div className="relative">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-md"
              style={{ background: server.color }}
            >
              {server.avatar}
            </div>
            {server.alerts.some((a) => a.type === "critical") && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 rounded-full bg-danger animate-pulse-danger opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-danger" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground leading-tight">{server.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Camera className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] font-mono text-muted-foreground">{server.camera}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${scoreLabelClass}`}>
            {scoreLabelText}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {server.serviceDuration}
          </div>
        </div>
      </div>

      {/* Gauge + quick metrics */}
      <div className="flex items-center gap-4 px-5 py-2">
        <PremiumGauge score={score} color={scoreColor} serverColor={server.color} />

        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-3">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Vitesse</p>
            <p className="text-sm font-bold text-foreground font-mono">{server.speed.toFixed(1)}<span className="text-[10px] text-muted-foreground ml-0.5">px/f</span></p>
            <p className={`text-[11px] font-semibold ${speedColor}`}>{server.speedLabel}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Réactivité</p>
            <p className="text-sm font-bold text-foreground font-mono">{server.avgResponseTime}<span className="text-[10px] text-muted-foreground ml-0.5">min</span></p>
            <p className={`text-[11px] font-semibold ${reactivityColor}`}>{reactivityLabel}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tables</p>
            <p className="text-sm font-bold text-foreground font-mono">{server.tablesVisited}<span className="text-[10px] text-muted-foreground">/{server.totalTables}</span></p>
            <p className="text-[11px] font-semibold text-muted-foreground">{Math.round(server.tablesVisited/server.totalTables*100)}% couverture</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Debout</p>
            <p className="text-sm font-bold text-foreground font-mono">{server.standingPercent}<span className="text-[10px] text-muted-foreground ml-0.5">%</span></p>
            <p className="text-[11px] font-semibold text-[hsl(var(--success))]">Actif</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-border" />

      {/* Metric bars */}
      <div className="flex flex-col gap-3 px-5 py-4">
        <MetricRow label="Vitesse de déplacement" value={server.speedScore}     weight="×30%" barColor={server.color} />
        <MetricRow label="Réactivité clients"      value={server.reactivityScore} weight="×30%" barColor={scoreColor} />
        <MetricRow label="Couverture des tables"   value={server.coverageScore}   weight="×25%" barColor="hsl(var(--success))" />
        <MetricRow label="Temps actif debout"      value={server.standingScore}   weight="×15%" barColor="hsl(217 91% 60%)" />
      </div>

      {/* Info chips */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-4">
        <InfoChip icon={Shield} label="Reconn." value={`${server.recognitionScore}%`} />
        <InfoChip icon={MapPin} label="Zone" value={server.lastZone.split(" - ")[1] || server.lastZone} />
        <InfoChip icon={Activity} label="Arrivée" value={server.arrivalTime} />
      </div>

      {/* Alerts */}
      {server.alerts.length > 0 && (
        <div className="border-t border-border">
          {server.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-2.5 px-5 py-2.5 text-[11px] leading-snug ${
                alert.type === "critical"
                  ? "bg-[hsl(var(--danger-dim))] text-[hsl(var(--danger))]"
                  : "bg-[hsl(var(--warning-dim))] text-[hsl(var(--warning))]"
              }`}
            >
              {alert.type === "critical"
                ? <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                : <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
              <span className="flex-1 font-medium">{alert.message}</span>
              <span className="font-mono font-bold shrink-0 opacity-70">{alert.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
