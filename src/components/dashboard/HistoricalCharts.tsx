import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { servers } from "@/data/mockData";

const CHART_STYLE = {
  background: "transparent",
  fontSize: 11,
};

const tooltipStyle = {
  backgroundColor: "hsl(220 18% 12%)",
  border: "1px solid hsl(220 14% 22%)",
  borderRadius: "8px",
  color: "hsl(210 20% 90%)",
  fontSize: "12px",
};

// Merge all time slots
const allSlots = [...new Set(servers.flatMap((s) => s.activityBySlot.map((a) => a.slot)))].sort();
const activityData = allSlots.map((slot) => {
  const row: Record<string, string | number> = { slot };
  servers.forEach((s) => {
    const found = s.activityBySlot.find((a) => a.slot === slot);
    row[s.name.split(" ")[0]] = found ? found.activity : 0;
  });
  return row;
});

// Bar comparison data
const comparisonData = servers.map((s) => ({
  name: s.name.split(" ")[0],
  "Tables visitées": s.tablesVisited,
  "Score": s.score,
  color: s.color,
}));

export function HistoricalCharts() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Score evolution */}
      <div className="rounded-xl border border-border bg-surface card-shadow">
        <div className="px-5 py-3 border-b border-border bg-surface-raised">
          <h3 className="text-sm font-semibold text-foreground">Score d'efficacité — Évolution</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Courbe par serveur sur le service</p>
        </div>
        <div className="p-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} style={CHART_STYLE}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="slot" tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(value) => <span style={{ color: "hsl(210 20% 80%)" }}>{value}</span>}
              />
              {servers.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.name.split(" ")[0]}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison bar */}
      <div className="rounded-xl border border-border bg-surface card-shadow">
        <div className="px-5 py-3 border-b border-border bg-surface-raised">
          <h3 className="text-sm font-semibold text-foreground">Comparaison des serveurs</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Score global & tables visitées</p>
        </div>
        <div className="p-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} style={CHART_STYLE} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(value) => <span style={{ color: "hsl(210 20% 80%)" }}>{value}</span>}
              />
              <Bar dataKey="Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Tables visitées" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity heatmap-like bar chart */}
      <div className="rounded-xl border border-border bg-surface card-shadow lg:col-span-2">
        <div className="px-5 py-3 border-b border-border bg-surface-raised">
          <h3 className="text-sm font-semibold text-foreground">Activité par tranche de 15 minutes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Niveau d'activité de chaque serveur durant le service</p>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} style={CHART_STYLE} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="slot" tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(value) => <span style={{ color: "hsl(210 20% 80%)" }}>{value}</span>}
              />
              {servers.map((s) => (
                <Bar
                  key={s.id}
                  dataKey={s.name.split(" ")[0]}
                  fill={s.color}
                  radius={[2, 2, 0, 0]}
                  fillOpacity={0.85}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
