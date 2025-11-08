import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { useDashboardStat } from "@/hooks/useHook"; // <-- your hook file
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function StatsOverview() {
  const token = useSelector((state: RootState) => state?.auth?.user?.token);

  const { data, isLoading, error } = useDashboardStat(token as string);
  console.log(data?.data);

  if (error) {
    return <div>Failed to load dashboard stats.</div>;
  }

  const stats = [
    {
      title: "Total Users",
      value: isLoading ? "Loading" : data?.data?.users ?? 0,
      icon: Users,
      color: "text-blue-500",
      change: "+5.2% since last week",
    },
    {
      title: "Total Listings",
      value: isLoading ? "Loading" : data?.data?.listings ?? 0,
      icon: DollarSign,
      color: "text-green-500",
      change: "+2.1% this month",
    },
    {
      title: "Total Reports",
      value: isLoading ? "Loading" : data?.data?.reports ?? 0,
      icon: Activity,
      color: "text-red-500",
      change: "No change",
    },
    {
      title: "KYC Pending",
      value: isLoading ? "Loading" : data?.data?.kycPending ?? 0,
      icon: TrendingUp,
      color: "text-yellow-500",
      change: "-1.3% since last week",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`${stat.color} w-4 h-4`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-primary">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
