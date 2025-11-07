import { useGetRideMonthlyStats } from "@/hooks/useHook";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Month order for sorting
const MONTH_ORDER = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
} as const;

export function MonthlyRidesChart() {
  const { data, isLoading, error } = useGetRideMonthlyStats();

  // Define the shape of our chart data
  interface ChartDataItem {
    month: string;
    rides: number;
  }

  // Process API data when available
  let chartData: ChartDataItem[] = [];

  if (data?.data) {
    // Convert API data to chart format and sort by month
    chartData = Object.entries(data.data)
      .map(([month, rides]) => ({
        month: month.substring(0, 3), // Convert full month name to short form (e.g., 'November' -> 'Nov')
        rides: Number(rides),
      }))
      .sort(
        (a, b) =>
          (MONTH_ORDER[a.month as keyof typeof MONTH_ORDER] || 0) -
          (MONTH_ORDER[b.month as keyof typeof MONTH_ORDER] || 0)
      );
  }
  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#004CFF] animate-spin mb-4" />
          <p className="text-gray-600">Loading monthly statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border border-red-100 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Data
          </h3>
          <p className="text-sm text-red-500">
            {error.message || "Failed to load monthly statistics"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Rides</h3>
        <p className="mt-1 text-sm text-gray-600">Total rides per month</p>
      </div>

      <div className="w-full" style={{ minHeight: "300px" }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#666"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#f0f0f0" }}
              />
              <YAxis
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
                axisLine={{ stroke: "#f0f0f0" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 500 }}
                itemStyle={{ color: "#004CFF" }}
                formatter={(value) => [`${value} rides`, "Total Rides"]}
              />
              <Bar
                dataKey="rides"
                fill="#004CFF"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No ride data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
}
