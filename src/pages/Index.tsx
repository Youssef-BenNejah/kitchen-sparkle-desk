import { AlertTriangle, XCircle } from "lucide-react";
import { GlobalHeader } from "@/components/dashboard/GlobalHeader";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { HistoricalCharts } from "@/components/dashboard/HistoricalCharts";
import { servers } from "@/data/mockData";

/* ── Panneau d'alertes compactes ─────────────────────────── */
function AlertsStrip() {
  const alerts = servers
    .flatMap((s) => s.alerts.map((a) => ({ ...a, serverName: s.name, serverColor: s.color })))
    .sort((a) => (a.type === "critical" ? -1 : 1));

  if (alerts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger-dim))] overflow-hidden animate-fade-up" style={{ boxShadow: "var(--shadow-danger)" }}>
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[hsl(var(--danger)/0.2)]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--danger))]">
          <XCircle className="h-3 w-3 text-white" />
        </span>
        <span className="text-sm font-bold text-[hsl(var(--danger))]">
          {alerts.filter((a) => a.type === "critical").length} alerte(s) critique(s) active(s)
        </span>
        <span className="ml-auto rounded-full bg-[hsl(var(--danger))] px-2.5 py-0.5 text-xs font-black text-white">
          {alerts.length} total
        </span>
      </div>
      <div className="flex flex-col divide-y divide-[hsl(var(--danger)/0.15)]">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 px-5 py-2.5">
            {alert.type === "critical"
              ? <XCircle className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--danger))]" />
              : <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--warning))]" />}
            <span className="text-xs text-foreground flex-1">{alert.message}</span>
            <span className="text-[11px] font-bold font-mono shrink-0" style={{ color: alert.serverColor }}>
              {alert.serverName.split(" ")[0]}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section header ──────────────────────────────────────── */
function SectionHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-lg font-black text-foreground tracking-tight">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────── */
const Index = () => {
  const criticalAlerts = servers.flatMap((s) => s.alerts.filter((a) => a.type === "critical"));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-7 space-y-8">

        {/* Alertes critiques */}
        {criticalAlerts.length > 0 && <AlertsStrip />}

        {/* Cartes serveurs */}
        <section>
          <SectionHeader
            title="Serveurs actifs"
            subtitle="Métriques individuelles · Mise à jour en temps réel via IA"
            right={
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />Excellent ≥ 70
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--warning))]" />À surveiller 40–69
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--danger))]" />Alerte &lt; 40
                </span>
              </div>
            }
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {servers.map((server, i) => (
              <ServerCard key={server.id} server={server} delay={i * 90} />
            ))}
          </div>
        </section>

        {/* Graphiques historiques */}
        <section>
          <SectionHeader
            title="Analyse du service"
            subtitle="Évolution des performances · Comparaison entre serveurs"
          />
          <HistoricalCharts />
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-border pt-5 pb-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-amber">
              <span className="text-[8px] font-black text-primary-foreground">TK</span>
            </div>
            <span>The Kitchen AI System · 6 caméras IMOU · ArcFace + Classificateur uniforme</span>
          </div>
          <span className="font-mono">Service en cours · Démarré à 19:00</span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
