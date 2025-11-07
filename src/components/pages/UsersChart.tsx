"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "W1", users: 400 },
  { week: "W2", users: 600 },
  { week: "W3", users: 500 },
  { week: "W4", users: 800 },
  { week: "W5", users: 700 },
  { week: "W6", users: 900 },
];

export function UsersChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--color-border))"
            />
            <XAxis dataKey="week" stroke="hsl(var(--color-foreground))" />
            <YAxis stroke="hsl(var(--color-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="rgb(0, 102, 255)"
              strokeWidth={2}
              dot={{ fill: "rgb(0, 102, 255)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
