import { GlobalHeader } from "@/components/dashboard/GlobalHeader";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { FloorMap } from "@/components/dashboard/FloorMap";
import { HistoricalCharts } from "@/components/dashboard/HistoricalCharts";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { servers } from "@/data/mockData";

const Index = () => {
  const criticalCount = servers.reduce(
    (acc, s) => acc + s.alerts.filter((a) => a.type === "critical").length, 0
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />

      <main className="flex-1 px-4 py-5 md:px-6 lg:px-8 space-y-6 max-w-[1600px] w-full mx-auto">

        {/* Alerts panel (only if there are alerts) */}
        {criticalCount > 0 && <AlertsPanel />}

        {/* Server cards grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Serveurs actifs</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Métriques individuelles · Mise à jour temps réel
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                ≥ 70 Excellent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warning" />
                40–69 À surveiller
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger" />
                &lt; 40 Alerte
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {servers.map((server, i) => (
              <div key={server.id} style={{ animationDelay: `${i * 80}ms` }}>
                <ServerCard server={server} />
              </div>
            ))}
          </div>
        </section>

        {/* Floor map */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Plan de salle</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Position en temps réel · Carte thermique de présence
            </p>
          </div>
          <FloorMap />
        </section>

        {/* Historical charts */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Historique du service</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Évolution des scores · Comparaison · Activité par tranche horaire
            </p>
          </div>
          <HistoricalCharts />
        </section>

        {/* All alerts at bottom */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Journal des alertes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Alertes automatiques du service en cours</p>
          </div>
          <AlertsPanel />
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-4 pb-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>The Kitchen AI System · 6 caméras IMOU · ArcFace + Classificateur uniforme</span>
          <span className="font-mono">v1.0 · Service en cours depuis 19:00</span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
