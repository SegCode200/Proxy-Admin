import { useState } from "react";
import {
  Search,
  Flag,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
} from "lucide-react";
import { useGetAllReports, useResolveReport } from "@/hooks/useHook";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";

interface Report {
  id: string;
  type: string;
  description: string;
  status: "PENDING" | "RESOLVED";
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  reportedUser?: {
    id: string;
    name: string;
    email: string;
  };
  listing?: {
    id: string;
    title: string;
  };
  createdAt: string;
  resolvedAt?: string;
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, mutate } = useGetAllReports(
    useSelector(selectUser)?.token || ""
  );
  const { resolveReportData, isResolving } = useResolveReport();

  console.log("Reports Data", data);

  // Extract reports from API response
  const reports: Report[] =
    data && Array.isArray(data.reports)
      ? data.reports.map((item: any) => ({
          id: item.id || item._id,
          type: item.type || "GENERAL",
          description: item.description || item.reason || "",
          status: item.status || "PENDING",
          reportedBy: item.reportedBy || {
            id: "",
            name: "Unknown",
            email: "",
          },
          reportedUser: item.reportedUser,
          listing: item.listing,
          createdAt: item.createdAt || new Date().toISOString(),
          resolvedAt: item.resolvedAt,
        }))
      : [];

  const filteredReports = reports.filter(
    (report) =>
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResolveReport = async (reportId: string) => {
    const token = useSelector(selectUser)?.token;
    if (!token) return;

    try {
      await resolveReportData(reportId, token);
      mutate(); // Refresh reports
      setIsModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  const openReportModal = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "spam":
        return "bg-red-100 text-red-800";
      case "inappropriate":
        return "bg-orange-100 text-orange-800";
      case "fraud":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Flag
            size={48}
            className="mx-auto mb-4 opacity-50 text-muted-foreground"
          />
          <p className="text-muted-foreground">Failed to load reports</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Manage user reports and complaints
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 mb-6 border rounded-lg bg-card border-border">
        <div className="relative max-w-md">
          <Search
            className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-6 transition-shadow border rounded-lg bg-card border-border hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                  <Flag size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {report.type}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        report.type
                      )}`}
                    >
                      {report.type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openReportModal(report)}
                className="p-2 transition-colors text-muted-foreground hover:text-blue-600"
                title="View report details"
              >
                <Eye size={16} />
              </button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
              {report.description}
            </p>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Reported by:</span>{" "}
                {report.reportedBy.name}
              </div>
              {report.reportedUser && (
                <div>
                  <span className="font-medium">Reported user:</span>{" "}
                  {report.reportedUser.name}
                </div>
              )}
              {report.listing && (
                <div>
                  <span className="font-medium">Listing:</span>{" "}
                  {report.listing.title}
                </div>
              )}
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>

            {report.status === "PENDING" && (
              <button
                onClick={() => handleResolveReport(report.id)}
                disabled={isResolving}
                className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResolving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {isResolving ? "Resolving..." : "Resolve Report"}
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <Flag size={48} className="mx-auto mb-4 opacity-50" />
          <p>No reports found</p>
          <p className="mt-2 text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : "No reports have been submitted yet"}
          </p>
        </div>
      )}

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl border rounded-lg bg-card border-border">
            <div className="flex items-center justify-between p-6 border-b bg-card border-border">
              <h2 className="text-xl font-bold text-foreground">
                Report Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Report Type
                  </label>
                  <p className="text-foreground">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="mt-1 text-foreground">
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reported By
                  </label>
                  <div className="mt-1">
                    <p className="font-medium text-foreground">
                      {selectedReport.reportedBy.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReport.reportedBy.email}
                    </p>
                  </div>
                </div>

                {selectedReport.reportedUser && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Reported User
                    </label>
                    <div className="mt-1">
                      <p className="font-medium text-foreground">
                        {selectedReport.reportedUser.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.reportedUser.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedReport.listing && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Related Listing
                  </label>
                  <p className="mt-1 font-medium text-foreground">
                    {selectedReport.listing.title}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="mt-1 text-foreground">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedReport.resolvedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Resolved At
                    </label>
                    <p className="mt-1 text-foreground">
                      {new Date(selectedReport.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedReport.status === "PENDING" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-border text-foreground hover:bg-accent"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id)}
                    disabled={isResolving}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResolving ? (
                      <>
                        <Loader2
                          size={16}
                          className="inline mr-2 animate-spin"
                        />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="inline mr-2" />
                        Resolve Report
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
