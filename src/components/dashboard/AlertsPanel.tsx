import { AlertTriangle, XCircle } from "lucide-react";
import { servers } from "@/data/mockData";

export function AlertsPanel() {
  const allAlerts = servers
    .flatMap((s) => s.alerts.map((a) => ({ ...a, serverName: s.name, serverColor: s.color })))
    .sort((a, b) => (a.type === "critical" ? -1 : 1));

  if (allAlerts.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface card-shadow overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-danger animate-pulse-red" />
          <span className="text-sm font-semibold text-foreground">Alertes actives</span>
        </div>
        <span className="badge-danger rounded-full px-2 py-0.5 text-xs font-bold">
          {allAlerts.length}
        </span>
      </div>
      <div className="divide-y divide-border/50 max-h-52 overflow-y-auto">
        {allAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 px-5 py-3 ${
              alert.type === "critical" ? "bg-danger/5" : "bg-warning/5"
            }`}
          >
            {alert.type === "critical" ? (
              <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-danger" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-snug">{alert.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: alert.serverColor }}
                >
                  {alert.serverName}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
              </div>
            </div>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                alert.type === "critical" ? "badge-danger" : "badge-warning"
              }`}
            >
              {alert.type === "critical" ? "CRITIQUE" : "AVERT."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
