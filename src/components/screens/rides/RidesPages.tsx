import { RidesTable } from "./RidesTable";
import { RidesStats } from "./RidesStats";
import { MonthlyRidesChart } from "./RidesMonthlyStat";

export default function RidesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rides Management</h1>
        <p className="mt-2 text-gray-600">
          Track and manage all rides in your platform
        </p>
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <RidesStats />
      </div>

      {/* Monthly Rides Chart */}
      <div className="mt-8">
        <MonthlyRidesChart />
      </div>

      {/* Rides Table */}
      <div className="mt-8">
        <RidesTable />
      </div>
    </div>
    // </div>
  );
}
