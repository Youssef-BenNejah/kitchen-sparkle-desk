import { useState } from "react";
import { AlertTriangle, XCircle, Video } from "lucide-react";
import { GlobalHeader } from "@/components/dashboard/GlobalHeader";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { HistoricalCharts } from "@/components/dashboard/HistoricalCharts";
import { VideoModal } from "@/components/dashboard/VideoModal";
import { servers } from "@/data/mockData";

/* ── Alertes ─────────────────────────────────────────────── */
function AlertsStrip() {
  const [videoModal, setVideoModal] = useState<{ camera: string; time: string; message: string } | null>(null);

  const alerts = servers
    .flatMap((s) => s.alerts.map((a) => ({ ...a, serverName: s.name, serverColor: s.color, camera: s.camera })))
    .sort((a) => (a.type === "critical" ? -1 : 1));
  if (alerts.length === 0) return null;

  return (
    <>
      <div
        className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger-dim))] overflow-hidden animate-fade-up"
        style={{ boxShadow: "var(--shadow-danger)" }}
      >
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[hsl(var(--danger)/0.2)]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--danger))]">
            <XCircle className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-base font-bold text-[hsl(var(--danger))] flex-1 min-w-0 truncate">
            {alerts.filter((a) => a.type === "critical").length} alerte(s) critique(s)
          </span>
          <span className="shrink-0 rounded-full bg-[hsl(var(--danger))] px-2.5 py-0.5 text-xs font-black text-white">
            {alerts.length} total
          </span>
        </div>
        <div className="divide-y divide-[hsl(var(--danger)/0.12)]">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3 px-5 py-3.5">
              {alert.type === "critical"
                ? <XCircle className="h-4.5 w-4.5 shrink-0 text-[hsl(var(--danger))]" />
                : <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-[hsl(var(--warning))]" />}
              <span className="text-sm text-foreground flex-1 leading-snug font-medium">{alert.message}</span>
              <div className="flex items-center gap-2.5 shrink-0 ml-1">
                {alert.videoUrl && (
                  <button
                    onClick={() => setVideoModal({ camera: alert.camera, time: alert.time, message: alert.message })}
                    className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.1)] px-2.5 py-1.5 text-xs font-bold text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.2)] transition-colors cursor-pointer"
                    title="Voir la vidéo de l'incident"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{alert.camera} · {alert.time}</span>
                  </button>
                )}
                <span className="text-xs font-bold hidden sm:block" style={{ color: alert.serverColor }}>
                  {alert.serverName.split(" ")[0]}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VideoModal
        open={!!videoModal}
        onClose={() => setVideoModal(null)}
        camera={videoModal?.camera || ""}
        time={videoModal?.time || ""}
        alertMessage={videoModal?.message || ""}
      />
    </>
  );
}

/* ── Section header ──────────────────────────────────────── */
function SectionHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 md:mb-5">
      <div>
        <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {right && <div className="hidden sm:flex">{right}</div>}
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────── */
const Index = () => {
  const criticalAlerts = servers.flatMap((s) => s.alerts.filter((a) => a.type === "critical"));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-7 space-y-5 md:space-y-8">

        {/* Alertes critiques */}
        {criticalAlerts.length > 0 && <AlertsStrip />}

        {/* Cartes serveurs */}
        <section>
          <SectionHeader
            title="Serveurs actifs"
            subtitle="Métriques individuelles · Mise à jour en temps réel via IA"
            right={
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />Excellent ≥ 70
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--warning))]" />40–69
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--danger))]" />&lt; 40
                </span>
              </div>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
            {servers.map((server, i) => (
              <ServerCard key={server.id} server={server} delay={i * 80} />
            ))}
          </div>
        </section>

        {/* Graphiques */}
        <section>
          <SectionHeader
            title="Analyse du service"
            subtitle="Évolution des performances · Comparaison entre serveurs"
          />
          <HistoricalCharts />
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-border pt-4 pb-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-amber">
              <span className="text-[7px] font-black text-primary-foreground">TK</span>
            </div>
            <span className="leading-snug">The Kitchen AI · 6 caméras IMOU · ArcFace + Classificateur</span>
          </div>
          <span className="font-mono">Service en cours · 19:00</span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
