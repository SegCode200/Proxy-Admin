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
import { Input } from "@/components/ui/input";
import { Loader2, Search, Store, Check, X } from "lucide-react";
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
import {
  useGetVendorApplications,
  useApproveVendor,
  useRejectVendor,
} from "@/hooks/useHook";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

// Import the VendorApplication type from useHook
import type { VendorApplication } from "@/hooks/useHook";

export function VendorApplicationsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "reject" | null;
    applicationId: string | null;
    businessName: string | null;
    rejectionNote: string;
  }>({
    open: false,
    action: null,
    applicationId: null,
    businessName: null,
    rejectionNote: "",
  });

  const token = useSelector((state: RootState) => state?.auth?.user?.token);

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useGetVendorApplications(token || "");
  console.log("App", applications);
  const { approve: approveApplication, isLoading: isApproving } =
    useApproveVendor();
  const { reject: rejectApplication, isLoading: isRejecting } =
    useRejectVendor();

  // Ensure applications is always an array and properly typed
  const safeApplications: VendorApplication[] = applications;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading vendor applications...</span>
      </div>
    );
  }

  if (!safeApplications.length) {
    return (
      <div className="py-12 text-center">
        <Store className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          No vendor applications found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          All applications have been processed.
        </p>
      </div>
    );
  }

  // Filter applications based on search term
  const filteredApplications = safeApplications.filter(
    (app: VendorApplication) => {
      if (!searchTerm.trim()) return true; // Return all if search term is empty

      const searchLower = searchTerm.toLowerCase();
      const userName = app.user?.name?.toLowerCase() || "";
      const userEmail = app.user?.email?.toLowerCase() || "";
      const userPhone = app.user?.phone?.toLowerCase() || "";

      return (
        userName.includes(searchLower) ||
        userEmail.includes(searchLower) ||
        userPhone.includes(searchLower) ||
        (app.description?.toLowerCase() || "").includes(searchLower)
      );
    }
  );

  const handleApprove = async (id: string) => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    try {
      console.log("Approving vendor application with ID:", id);
      const response = await approveApplication(id, token);
      console.log("Vendor approval successful:", response);
      refetch();
    } catch (error) {
      console.error("Error approving vendor:", error);
    }
  };

  const handleReject = async (id: string, note: string = "") => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    try {
      console.log("Rejecting vendor application with ID:", id, "Note:", note);
      const response = await rejectApplication(id, token, note);
      console.log("Vendor rejection successful:", response);
      refetch();
      return response;
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10"
            />
          </div>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm bg-card text-card-foreground">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-12 font-medium text-muted-foreground">
                  Owner
                </TableHead>
                <TableHead className="h-12 font-medium text-muted-foreground">
                  Contact
                </TableHead>
                <TableHead className="h-12 font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-12 font-medium text-muted-foreground">
                  Applied Date
                </TableHead>
                <TableHead className="w-12 h-12 font-medium text-right text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.length > 0 ? (
                filteredApplications.map((app: VendorApplication) => (
                  <TableRow
                    key={app.id}
                    className="transition-colors border-t group hover:bg-muted/10"
                  >
                    <TableCell className="py-4">
                      <div className="font-medium">{app.user.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {app.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium">{app.user.phone}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-transparent ${
                          app.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </Badge>
                      {app.rejectionNote && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Reason: {app.rejectionNote}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(app.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {app.status === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                action: "approve",
                                applicationId: app.id,
                                businessName: app.user.name,
                                rejectionNote: "",
                              })
                            }
                            className="h-8 text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                action: "reject",
                                applicationId: app.id,
                                businessName: app.user.name,
                                rejectionNote: "",
                              })
                            }
                            className="h-8 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No vendor applications found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredApplications.length > 0 && (
          <div className="text-sm text-center text-muted-foreground">
            Showing {filteredApplications.length} application
            {filteredApplications.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog((prev) => ({
              ...prev,
              open: false,
              action: null,
              applicationId: null,
              businessName: null,
              rejectionNote: "",
            }));
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[425px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "approve" ? "Approve" : "Reject"} Vendor
              Application
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to {confirmDialog.action} the vendor
              application for "{confirmDialog.businessName}"?
              {confirmDialog.action === "reject" && (
                <div className="mt-4 space-y-2">
                  <p>Please provide a reason for rejection:</p>
                  <textarea
                    className="w-full p-2 mt-2 border rounded-md min-h-[100px] bg-white"
                    placeholder="Enter rejection reason..."
                    value={confirmDialog.rejectionNote}
                    onChange={(e) =>
                      setConfirmDialog((prev) => ({
                        ...prev,
                        rejectionNote: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <p className="mt-2">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between">
            <AlertDialogCancel
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  action: null,
                  applicationId: null,
                  businessName: null,
                  rejectionNote: "",
                })
              }
              disabled={isApproving || isRejecting}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                if (!confirmDialog.applicationId || !confirmDialog.action)
                  return;

                try {
                  if (confirmDialog.action === "approve") {
                    await handleApprove(confirmDialog.applicationId);
                  } else {
                    if (!confirmDialog.rejectionNote.trim()) {
                      alert("Please provide a rejection reason");
                      return;
                    }
                    await handleReject(
                      confirmDialog.applicationId,
                      confirmDialog.rejectionNote
                    );
                  }
                  setConfirmDialog({
                    open: false,
                    action: null,
                    applicationId: null,
                    businessName: null,
                    rejectionNote: "",
                  });
                } catch (error) {
                  console.error(
                    `Error ${confirmDialog.action}ing vendor:`,
                    error
                  );
                }
              }}
              disabled={isApproving || isRejecting}
              className={
                confirmDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isApproving || isRejecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {confirmDialog.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function VendorApplicationsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Vendor Applications
        </h1>
        <p className="text-muted-foreground">
          Review and manage vendor application requests
        </p>
      </div>

      <VendorApplicationsTable />
    </>
  );
}
