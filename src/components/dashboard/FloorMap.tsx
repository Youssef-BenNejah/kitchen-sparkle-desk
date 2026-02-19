import { tables, servers } from "@/data/mockData";

const tableStatusConfig = {
  free:     { fill: "hsl(var(--surface-raised))", stroke: "hsl(var(--border))",  label: "Libre" },
  occupied: { fill: "hsl(var(--warning-dim))",    stroke: "hsl(var(--warning))",  label: "Occupée" },
  visited:  { fill: "hsl(var(--success-dim))",    stroke: "hsl(var(--success))",  label: "Visitée" },
  waiting:  { fill: "hsl(var(--danger-dim))",     stroke: "hsl(var(--danger))",   label: "En attente" },
};

export function FloorMap() {
  return (
    <div className="rounded-xl border border-border bg-surface card-shadow overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-raised">
        <span className="text-sm font-semibold text-foreground">Plan de salle — Temps réel</span>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {Object.entries(tableStatusConfig).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm border"
                style={{ background: v.fill, borderColor: v.stroke }}
              />
              {v.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative p-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full"
          style={{ aspectRatio: "16 / 9", maxHeight: "340px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Restaurant outline */}
          <rect x="2" y="2" width="96" height="96" rx="3" fill="hsl(220 16% 9%)" stroke="hsl(var(--border))" strokeWidth="0.5" />

          {/* Zone labels */}
          <text x="8" y="8" fill="hsl(var(--foreground-subtle))" fontSize="2.2" fontFamily="Inter">Zone A</text>
          <text x="33" y="8" fill="hsl(var(--foreground-subtle))" fontSize="2.2" fontFamily="Inter">Zone B</text>
          <text x="57" y="8" fill="hsl(var(--foreground-subtle))" fontSize="2.2" fontFamily="Inter">Zone C</text>
          <text x="78" y="8" fill="hsl(var(--foreground-subtle))" fontSize="2.2" fontFamily="Inter">Zone D - Bar</text>

          {/* Zone separators */}
          <line x1="28" y1="4" x2="28" y2="96" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,1" />
          <line x1="53" y1="4" x2="53" y2="96" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,1" />
          <line x1="75" y1="4" x2="75" y2="96" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,1" />

          {/* Bar area */}
          <rect x="76" y="5" width="21" height="15" rx="1" fill="hsl(var(--surface))" stroke="hsl(var(--border))" strokeWidth="0.4" />
          <text x="86" y="13.5" textAnchor="middle" fill="hsl(var(--foreground-subtle))" fontSize="2" fontFamily="Inter">BAR</text>

          {/* Tables */}
          {tables.map((table) => {
            const cfg = tableStatusConfig[table.status];
            return (
              <g key={table.id}>
                <rect
                  x={table.x - 5}
                  y={table.y - 4}
                  width="10"
                  height="8"
                  rx="1"
                  fill={cfg.fill}
                  stroke={cfg.stroke}
                  strokeWidth="0.6"
                />
                <text
                  x={table.x}
                  y={table.y + 1.2}
                  textAnchor="middle"
                  fill="hsl(var(--foreground-muted))"
                  fontSize="2.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {table.id}
                </text>
                {table.status === "waiting" && table.waitMinutes && (
                  <text
                    x={table.x}
                    y={table.y + 7}
                    textAnchor="middle"
                    fill="hsl(var(--danger))"
                    fontSize="2"
                    fontFamily="Inter"
                  >
                    {table.waitMinutes}m
                  </text>
                )}
              </g>
            );
          })}

          {/* Server positions */}
          {servers.map((server) => (
            <g key={server.id}>
              {/* Heatmap aura */}
              <circle
                cx={server.position.x}
                cy={server.position.y}
                r="8"
                fill={server.color}
                fillOpacity="0.07"
              />
              {/* Server dot */}
              <circle
                cx={server.position.x}
                cy={server.position.y}
                r="3"
                fill={server.color}
                stroke="hsl(var(--background))"
                strokeWidth="0.8"
              />
              {/* Name label */}
              <text
                x={server.position.x}
                y={server.position.y - 4.5}
                textAnchor="middle"
                fill={server.color}
                fontSize="2.2"
                fontFamily="Inter"
                fontWeight="600"
              >
                {server.name.split(" ")[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
