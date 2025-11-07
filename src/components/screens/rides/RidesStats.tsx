import { useGetRideStat } from "@/hooks/useHook";
import {
  MapPin,
  Users,
  Check,
  Clock,
  Ban,
  Award,
  User,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#004CFF]/30 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2">
            <p
              className={cn(
                "text-3xl font-bold",
                isLoading ? "text-gray-400 animate-pulse" : "text-gray-900"
              )}
            >
              {isLoading
                ? "..."
                : Intl.NumberFormat().format(Number(value) || 0)}
            </p>
            {trend && !isLoading && (
              <span
                className={cn(
                  "text-sm",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-lg transition-colors",
            isLoading ? "bg-gray-100" : "bg-[#004CFF]/10"
          )}
        >
          <Icon
            size={24}
            className={cn(
              "transition-colors",
              isLoading ? "text-gray-400" : "text-[#004CFF]"
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function RidesStats() {
  const { data, isLoading, error } = useGetRideStat();

  const stats = [
    {
      title: "Total Deliveries",
      value: data?.data?.totalDeliveries ?? 0,
      icon: MapPin,
    },
    {
      title: "Active/Total Riders",
      value: data?.data?.totalRiders ?? 0,
      icon: Users,
    },
    {
      title: "Approved Riders",
      value: data?.data?.approved ?? 0,
      icon: Check,
    },
    {
      title: "Pending Riders",
      value: data?.data?.pending ?? 0,
      icon: Clock,
    },
    {
      title: "Rejected Riders",
      value: data?.data?.rejected ?? 0,
      icon: Ban,
    },
  ];
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <Ban className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Failed to load statistics</p>
          <p className="text-sm text-red-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading}
          />
        ))}
      </div>
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Top Riders</h2>
            <p className="text-sm text-gray-500 mt-1">
              Best performing riders this month
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#004CFF]/10">
            <Award className="text-[#004CFF]" size={24} />
          </div>
        </div>

        {error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Error loading top riders</p>
            <p className="text-sm text-red-500 mt-1">
              {error.message || "Failed to fetch top riders data"}
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 text-[#004CFF] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading top riders...</p>
          </div>
        ) : (data?.data?.topRiders?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.topRiders?.map((rider: any, index: number) => (
              <div
                key={rider.id || index}
                className="group border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-[#004CFF]/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-[#004CFF]/10 flex items-center justify-center group-hover:bg-[#004CFF]/20 transition-colors">
                      <User className="text-[#004CFF]" size={20} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#004CFF] transition-colors">
                      {rider.name || `Rider #${index + 1}`}
                    </p>
                    <div className="flex items-center mt-1 gap-2">
                      <div className="flex items-center">
                        <Star
                          className="text-yellow-400 mr-1"
                          size={14}
                          fill="currentColor"
                        />
                        <span className="text-xs text-gray-500">
                          {rider.rating
                            ? `${rider.rating.toFixed(1)}/5`
                            : "No rating"}
                        </span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center">
                        <MapPin className="text-gray-400 mr-1" size={14} />
                        <span className="text-xs text-gray-500">
                          {Intl.NumberFormat().format(rider.deliveries || 0)}{" "}
                          deliveries
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No top riders available</p>
            <p className="text-sm text-gray-500 mt-1">
              Top performing riders will appear here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
