import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  MoreHorizontal,
  Search,
  Store,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllUsers } from "@/hooks/useHook";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "VENDOR";
  isBanned: boolean;
  createdAt: string;
  vendorApplication: {
    id: string;
  };
}

// // Sample data
// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "Ahmed Store",
//     email: "ahmed@store.com",
//     type: "seller",
//     status: "active",
//     joinDate: "2024-01-15",
//     revenue: 45000,
//   },
//   {
//     id: "2",
//     name: "Fresh Market",
//     email: "fresh@market.com",
//     type: "seller",
//     status: "active",
//     joinDate: "2024-02-10",
//     revenue: 32000,
//   },
//   {
//     id: "3",
//     name: "Mohamed Shop",
//     email: "mohamed@shop.com",
//     type: "seller",
//     status: "pending",
//     joinDate: "2024-11-01",
//     revenue: 0,
//   },
//   {
//     id: "4",
//     name: "Sarah Johnson",
//     email: "sarah@email.com",
//     type: "user",
//     status: "active",
//     joinDate: "2024-03-05",
//     orders: 12,
//   },
//   {
//     id: "5",
//     name: "Ali Hassan",
//     email: "ali.hassan@email.com",
//     type: "user",
//     status: "active",
//     joinDate: "2024-04-12",
//     orders: 8,
//   },
//   {
const userTypeLabels = {
  VENDOR: "Seller",
  USER: "Customer",
};

const userTypeColors = {
  VENDOR: "bg-blue-100 text-blue-800",
  USER: "bg-green-100 text-green-800",
};

interface UsersTableProps {
  userType: "all" | "USER" | "VENDOR";
}

export function UsersTable({ userType }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state: RootState) => state?.auth?.user?.token);
  const { data, isLoading, error } = useGetAllUsers(token as string, {
    roles: userType === 'all' ? ["USER", "VENDOR"] : [userType]
  });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">
          {error.message || "Failed to load users. Please try again later."}
        </span>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="py-12 text-center">
        <Users className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          No users found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by adding a new user.
        </p>
      </div>
    );
  }

  // Filter users based on search term
  const filteredUsers = data?.data?.filter((user: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <div className="flex items-center w-full gap-2 sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
          {userType !== "all" && (
            <Badge variant="outline" className="bg-accent/50">
              {userTypeLabels[userType as keyof typeof userTypeLabels]}
            </Badge>
          )}
        </div>
      </div>

      <div className="border rounded-lg shadow-sm bg-card text-card-foreground">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 font-medium text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="h-12 font-medium text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="h-12 font-medium text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="h-12 font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-12 h-12 font-medium text-right text-muted-foreground">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user: User) => (
                <TableRow
                  key={user.id}
                  className="transition-colors border-t group hover:bg-muted/10"
                >
                  <TableCell className="py-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <a
                      href={`mailto:${user.email}`}
                      className="transition-colors hover:text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        userTypeColors[user.role]
                      } border-transparent`}
                    >
                      {userTypeLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.isBanned ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <Badge
                        variant={user.isBanned ? "destructive" : "outline"}
                        className="text-black bg-transparent"
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/users-detailed/${
                                user.role === "VENDOR"
                                  ? user?.vendorApplication?.id
                                  : user.id
                              }`,
                              {
                                state: { role: user.role },
                              }
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                          >
                            <path d="M2 12s3-7.5 10-7.5 10 7.5 10 7.5-3 7.5-10 7.5-10-7.5-10-7.5Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Details
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" x2="8" y1="13" y2="13" />
                            <line x1="16" x2="8" y1="17" y2="17" />
                            <line x1="10" x2="8" y1="9" y2="9" />
                          </svg>
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                          {user.isBanned ? "Activate Account" : "Ban Account"}
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length > 0 && (
        <div className="text-sm text-center text-muted-foreground">
          Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground">
          Manage sellers and customers in your platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">All</span>
          </TabsTrigger>
          <TabsTrigger value="sellers" className="flex items-center gap-2">
            <Store size={16} />
            <span className="hidden sm:inline">Sellers</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UsersTable userType="all" />
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <UsersTable userType="VENDOR" />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersTable userType="USER" />
        </TabsContent>
      </Tabs>
    </>
  );
}
