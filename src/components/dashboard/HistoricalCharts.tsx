import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { servers } from "@/data/mockData";

const allSlots = [...new Set(servers.flatMap((s) => s.activityBySlot.map((a) => a.slot)))].sort();

const scoreData = allSlots.map((slot) => {
  const row: Record<string, string | number> = { slot };
  servers.forEach((s) => {
    const found = s.speedHistory.find((h) => h.time === slot);
    row[s.name.split(" ")[0]] = found ? found.value : 0;
  });
  return row;
});

const compData = servers.map((s) => ({
  name: s.name.split(" ")[0],
  Score: s.score,
  Tables: s.tablesVisited,
}));

const tooltipStyle = {
  backgroundColor: "hsl(var(--surface))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
  fontSize: "11px",
  boxShadow: "var(--shadow-lg)",
  padding: "8px 12px",
};

const gridColor = "hsl(var(--border))";
const tickColor = "hsl(var(--foreground-subtle))";

function ChartCard({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-surface-raised">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{subtitle}</p>
      </div>
      <div className="p-3 md:p-5">{children}</div>
    </div>
  );
}

export function HistoricalCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
      {/* Score evolution */}
      <ChartCard
        title="Évolution du score d'efficacité"
        subtitle="Courbe de performance par serveur"
      >
        <div className="h-48 sm:h-56 md:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.6} />
              <XAxis dataKey="slot" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                formatter={(v) => <span style={{ color: "hsl(var(--foreground-muted))" }}>{v}</span>}
              />
              {servers.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.name.split(" ")[0]}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: s.color }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Comparison bar */}
      <ChartCard
        title="Comparaison des serveurs"
        subtitle="Score global et tables servies"
      >
        <div className="h-48 sm:h-56 md:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData} barGap={4} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.6} />
              <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--border) / 0.25)" }} />
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                formatter={(v) => <span style={{ color: "hsl(var(--foreground-muted))" }}>{v}</span>}
              />
              <Bar dataKey="Score" radius={[5, 5, 0, 0]} fill="hsl(var(--primary))" />
              <Bar dataKey="Tables" radius={[5, 5, 0, 0]} fill="hsl(var(--success))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
