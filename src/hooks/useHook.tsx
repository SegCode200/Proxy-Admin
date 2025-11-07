import { dashboardStat } from "@/apis/dashboard";
import { getAllRides, getRidesMonthlyStat, getRidesStat } from "@/apis/rides";
import {
  allUserList,
  getOneRider,
  getOneUser,
  getOneVendor,
} from "@/apis/users";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { AllProduct } from "@/apis/listing";

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DashboardStats {
  totalUsers: number;
  totalRiders: number;
  totalVendors: number;
  totalDeliveries: number;
  recentActivity: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

interface Rider extends User {
  fullName: string;
  phone: string;
  vehicleType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isOnline: boolean;
  lastSeenAt: string;
  _count: {
    deliveries: number;
  };
}

// Product type for listing API
interface Product {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  price: number;
  currency: string;
  isDigital: boolean;
  condition: string;
  stock: number;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  categoryId: string;
  extraDetails: Array<{
    title: string;
    description: string;
  }>;
  seller: {
    id: string;
    email: string;
    name: string;
  };
}

interface RideStats {
  totalDeliveries: number;
  totalRiders: number;
  approved: number;
  pending: number;
  rejected: number;
  topRiders: Rider[];
}

// Common SWR Configuration
const defaultSWRConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  refreshInterval: 10000, // 10 seconds
  shouldRetryOnError: true,
  errorRetryCount: 3,
};

/**
 * Custom hook to fetch dashboard statistics
 * @param token Authentication token
 * @returns Dashboard statistics data, loading state, and error if any
 */
export const useDashboardStat = (token: string) => {
  const fetcher = async () => {
    try {
      const response = await dashboardStat(token);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch dashboard stats");
      }
      return response as ApiResponse<DashboardStats>;
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Failed to fetch dashboard stats");
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    token ? "/dashboardStat" : null,
    fetcher,
    defaultSWRConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useUserList = (token: string) => {
  const fetcher = async () => {
    return await allUserList(token);
  };

  const { data, error, isLoading, mutate } = useSWR("/users/list", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true, // Ensure it fetches when the component
    refreshInterval: 10000, // Refresh every 30 seconds
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
/**
 * Hook to fetch details of a specific user
 * @param id User ID
 * @returns User details, loading state, and error if any
 */
export const useGetOneUser = (id: string) => {
  const fetcher = async () => {
    try {
      const response = await getOneUser(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch user");
      }
      return response as ApiResponse<User>;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch user");
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    id ? `/users/${id}` : null,
    fetcher,
    defaultSWRConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
export const useGetOneRider = (id: string) => {
  const fetcher = async () => {
    return await getOneRider(id);
  };

  const { data, error, isLoading, mutate } = useSWR("/one/rider", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true, // Ensure it fetches when the component
    refreshInterval: 10000, // Refresh every 30 seconds
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
export const useGetAllUsers = (
  token: string,
  options?: { roles?: string[] }
) => {
  const fetcher = async () => {
    const response = await allUserList(token);
    if (options?.roles?.length) {
      return {
        ...response,
        data: response.data.filter(
          (user: any) =>
            options.roles?.includes(user.role) && user.role !== "ADMIN"
        ),
      };
    }
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(
    ["/users/all", options?.roles],
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useGetOneVendor = (id: string, token: string) => {
  const fetcher = async () => {
    return await getOneVendor(id, token);
  };

  const { data, error, isLoading, mutate } = useSWR("/one/vendor", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true, // Ensure it fetches when the component
    refreshInterval: 10000, // Refresh every 10 seconds
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch ride statistics
 * @returns Ride statistics including totals and counts
 */
export const useGetRideStat = () => {
  const fetcher = async () => {
    try {
      const response = await getRidesStat();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch ride statistics");
      }
      return response as ApiResponse<RideStats>;
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Failed to fetch ride statistics");
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    "/rides/stat",
    fetcher,
    defaultSWRConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    // Computed properties for convenience
    stats: data?.data,
    totalDeliveries: data?.data?.totalDeliveries ?? 0,
    totalRiders: data?.data?.totalRiders ?? 0,
  };
};
interface MonthlyStats {
  [month: string]: number;
}

/**
 * Hook to fetch monthly ride statistics
 * @returns Monthly ride counts and related data
 */
export const useGetRideMonthlyStats = () => {
  const fetcher = async () => {
    try {
      const response = await getRidesMonthlyStat();
      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch monthly statistics"
        );
      }
      return response as ApiResponse<MonthlyStats>;
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Failed to fetch monthly statistics");
    }
  };

  const { data, error, isLoading, mutate } = useSWR("/rides/monthly", fetcher, {
    ...defaultSWRConfig,
    refreshInterval: 60000, // Monthly stats can refresh less frequently
  });

  // Process the monthly data for easier consumption
  const processedData = data?.data
    ? Object.entries(data.data)
        .map(([month, count]) => ({
          month,
          rides: count,
        }))
        .sort(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        )
    : [];

  return {
    data,
    processedData,
    error,
    isLoading,
    mutate,
  };
};
/**
 * Hook to fetch all riders with their details
 * @returns List of riders, loading state, and error if any
 */
export const useGetAllRiders = () => {
  const fetcher = async () => {
    try {
      const response = await getAllRides();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch riders");
      }
      return response as ApiResponse<{
        riders: Rider[];
        total: number;
      }>;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch riders");
    }
  };

  const { data, error, isLoading, mutate } = useSWR("/riders", fetcher, {
    ...defaultSWRConfig,
    refreshInterval: 30000, // Override to 30 seconds for rider list
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch all products via admin listing API
 * @param token Authentication token (optional)
 * @returns raw response, processed products array, loading and error states
 */
export const useAllProduct = (token?: string) => {
  const fetcher = async () => {
    try {
      const response = await AllProduct(token);
      // API may return different shapes; return as-is and let caller handle
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch products");
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    token ? ["/products", token] : "/products",
    fetcher,
    {
      ...defaultSWRConfig,
      refreshInterval: 30000,
    }
  );

  // Normalize product list from response
  let products: Product[] = [];
  if (data) {
    if (Array.isArray(data)) products = data as Product[];
    else if (Array.isArray((data as any).data)) products = (data as any).data;
    else if (Array.isArray((data as any).products))
      products = (data as any).products;
    else if ((data as any).items && Array.isArray((data as any).items))
      products = (data as any).items;
  }

  return {
    data,
    products,
    error,
    isLoading,
    mutate,
  };
};
