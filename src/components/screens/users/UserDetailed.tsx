import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  ArrowLeft,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  Users,
  PackageOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetOneUser, useGetOneVendor } from "@/hooks/useHook";
import { banUser, unbanUser } from "@/apis/ban_report";
import { mutate } from "swr";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const token = useSelector((state: RootState) => state?.auth?.user?.token);
  const userType = location.state?.role || "USER";
  const [showBanAlert, setShowBanAlert] = useState(false);

  const userResult =
    userType === "VENDOR"
      ? useGetOneVendor(id || "", token || "")
      : useGetOneUser(id || "");

  const { data: response, isLoading, error } = userResult;
  const user = response?.data;

  const handleBan = async () => {
    try {
      const res = user.isBanned
        ? await unbanUser(token as string, id as string)
        : await banUser(token as string, id as string);

      console.log("ban", res);

      userType === "VENDOR" ? mutate("/one/vendor") : mutate("/one/user");

      setShowBanAlert(false);
    } catch (error) {
      console.error("Ban error:", error);
    }
  };

  const getUserInitials = (userData: any) => {
    // Handle vendor data structure
    if (userType === "VENDOR") {
      // For vendor, use first character of email from user.user
      if (userData?.user?.email) {
        return userData.user.email.charAt(0).toUpperCase();
      }
      // Fallback to name if email is not available
      const name = userData?.user?.name || userData?.name;
      return name ? name.charAt(0).toUpperCase() : "V";
    }

    // For regular users, use name initials
    const name = userData?.name;
    if (!name) return userData?.email?.[0]?.toUpperCase() || "U";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const typeColors = {
    VENDOR: "bg-blue-100 text-blue-800",
    USER: "bg-green-100 text-green-800",
    RIDERS: "bg-purple-100 text-purple-800",
  };

  const statusColors = {
    active: "bg-emerald-100 text-emerald-800",
    banned: "bg-red-100 text-red-800",
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Skeleton className="w-64 h-8" />
        </div>
        <Skeleton className="w-full h-64 rounded-lg" />
        <Skeleton className="w-full h-64 rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMsg =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "An unexpected error occurred.";

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="mb-2 text-2xl font-semibold text-red-600">
          Error Loading User
        </h2>
        <p className="mb-4 text-muted-foreground">{errorMsg}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  // No data
  if (!user) {
    return (
      <div className="p-8 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold">User Not Found</h2>
        <p className="mb-4 text-muted-foreground">
          The user you’re looking for doesn’t exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {userType === "VENDOR" ? user?.user?.email : user?.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {userType === "VENDOR" ? "Vendor Account" : "Customer Account"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowBanAlert(true)}
              >
                {user.isBanned ? "Unban" : "Ban"} Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ban confirmation alert */}
        <AlertDialog open={showBanAlert} onOpenChange={setShowBanAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {user.isBanned ? "Unban" : "Ban"} Account
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {user.isBanned ? "unban" : "ban"} this
                account? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBan}>
                {user.isBanned ? "Unban" : "Ban"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Profile section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="text-center transition-shadow shadow-sm hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-24 h-24 mb-4 text-2xl font-bold text-white rounded-full bg-primary">
                {getUserInitials(user)}
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex justify-center gap-2 mt-3 mb-6">
                <Badge
                  className={typeColors[userType as keyof typeof typeColors]}
                >
                  {userType}
                </Badge>
                <Badge
                  className={
                    user.isBanned ? statusColors.banned : statusColors.active
                  }
                >
                  {user.isBanned ? "Banned" : "Active"}
                </Badge>
              </div>

              <div className="space-y-3 text-sm w-full text-left max-w-[280px] mx-auto">
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p>
                      {userType === "VENDOR" ? user.user.email : user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p>
                      {userType === "VENDOR"
                        ? user.user.phone
                        : user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                {user.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p>
                        {user.location.Address ||
                          [
                            user.location.city,
                            user.location.region,
                            user.location.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor stats */}
        <div className="space-y-4 md:col-span-2">
          {userType === "VENDOR" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${(user.revenue || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {(user.totalOrders || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">
                {userType === "RIDERS" ? "Deliveries" : "Orders"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="pt-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {userType === "VENDOR"
                          ? user?.user?.email
                          : user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {userType === "VENDOR"
                          ? user?.user?.phone
                          : user?.phone || "Not provided"}
                      </p>
                    </div>
                    {userType === "VENDOR" ? (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {user.location?.Address ||
                            [
                              user.location?.city,
                              user.location?.region,
                              user.location?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") ||
                            "No address information"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">
                Recent {userType === "RIDERS" ? "Deliveries" : "Orders"}
              </h3>

              {user.order?.length ? (
                <div className="space-y-3">
                  {user.order.map((order: any) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                Order #{order.id?.substring(0, 8).toUpperCase()}
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  order.status === "DELIVERED"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : order.status === "PENDING"
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "bg-gray-50 text-gray-700"
                                }
                              >
                                {order.status.charAt(0) +
                                  order.status.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            <p className="text-sm">
                              {order.isDigital ? "Digital" : "Physical"} Product
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ₦{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-2 text-sm border-t bg-muted/5">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Order ID:
                            </span>
                            <span className="font-mono">{order.id}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                  <PackageOpen className="w-12 h-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="max-w-md mt-1 text-sm text-muted-foreground">
                    {userType === "VENDOR"
                      ? "This vendor has no order history."
                      : userType === "RIDERS"
                      ? "No delivery history available."
                      : "No order history found."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
