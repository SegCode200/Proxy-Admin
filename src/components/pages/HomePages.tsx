import { StatsOverview } from "./StatsOverview";
import { RevenueChart } from "./RevenueChart";
import { UsersChart } from "./UsersChart";
import { RecentActivity } from "./RecentActivity";

const HomePages = () => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your performance overview.
        </p>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <UsersChart />
      </div>

      <RecentActivity />
    </>
  );
};

export default HomePages;
