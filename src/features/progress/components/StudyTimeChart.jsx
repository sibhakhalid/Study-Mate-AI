import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../../../components/ui/Card";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const minutes = payload[0].value;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 shadow-soft text-xs">
      <p className="font-medium text-ink">{label}</p>
      <p className="text-ink-muted">{minutes} min studied</p>
    </div>
  );
}

export default function StudyTimeChart({ data }) {
  return (
    <Card variant="default">
      <h3 className="font-display text-base font-medium text-ink mb-4">
        Study time — last 14 days
      </h3>
      <div className="h-56" role="img" aria-label="Bar chart of minutes studied over the last 14 days">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EDE8DE" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9C9C9C" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9C9C9C" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F1E9FA" }} />
            <Bar dataKey="minutes" fill="#D8C4F0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
