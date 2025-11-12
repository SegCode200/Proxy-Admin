import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  Loader2,
} from "lucide-react";
import { KycModal } from "./KycModal";
import { useGetKycRequests, useUpdateKycStatus } from "@/hooks/useHook";
import { selectUser } from "@/store/authSlice";

interface KycRequest {
  id: string;
  userId: string;
  userName: string;
  userType: "seller" | "customer" | "rider";
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  documentType: string;
  idNumber: string;
  address: string;
  city: string;
  country: string;
  documents: {
    idFront: string;
    idBack: string;
    selfie: string;
    proofOfAddress?: string;
  };
}

export default function KycPage() {
  const token = useSelector(selectUser)?.token;
  const { data, isLoading, error, mutate } = useGetKycRequests(token || "");
  const { updateStatus } = useUpdateKycStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedKyc, setSelectedKyc] = useState<KycRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract KYC requests from API response
  const kycRequests: KycRequest[] =
    data?.success && Array.isArray(data.data)
      ? data.data.map((item: any) => ({
          id: item.id || item._id,
          userId: item.userId || item.user?.id,
          userName: item.user?.name || "Unknown User",
          userType:
            item.user?.role?.toLowerCase() === "vendor"
              ? "seller"
              : item.user?.role?.toLowerCase() === "rider"
              ? "rider"
              : "customer",
          email: item.user?.email || "",
          phone: item.user?.phone || "",
          status: item.status?.toLowerCase() || "pending",
          submittedDate:
            item.createdAt || new Date().toISOString().split("T")[0],
          documentType: item.nin ? "NIN" : "ID Card",
          idNumber: item.nin || "",
          address: "", // Not provided in API
          city: "", // Not provided in API
          country: "", // Not provided in API
          documents: {
            idFront: item.idCardUrl || "",
            idBack: "", // Not provided in API
            selfie: item.selfieUrl || "",
            proofOfAddress: "", // Not provided in API
          },
        }))
      : [];

  const filteredRequests = kycRequests.filter((request) => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (kyc: KycRequest) => {
    setSelectedKyc(kyc);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    if (!token) return;

    try {
      await updateStatus(id, "APPROVED", token);
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to approve KYC request:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;

    try {
      await updateStatus(id, "REJECTED", token);
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to reject KYC request:", error);
    }
  };

  const stats = {
    pending: kycRequests.filter((r) => r.status === "pending").length,
    approved: kycRequests.filter((r) => r.status === "approved").length,
    rejected: kycRequests.filter((r) => r.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading KYC requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Shield
            size={48}
            className="mx-auto mb-4 opacity-50 text-muted-foreground"
          />
          <p className="text-muted-foreground">Failed to load KYC requests</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          KYC Verification
        </h1>
        <p className="text-muted-foreground">
          Review and verify user identity documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-yellow-700">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.pending}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/20">
              <FileText className="text-yellow-700" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-green-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-green-700">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.approved}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20">
              <CheckCircle className="text-green-700" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-red-500/10 border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-red-700">Rejected</p>
              <p className="text-3xl font-bold text-red-900">
                {stats.rejected}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/20">
              <XCircle className="text-red-700" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 mb-6 border rounded-lg bg-card border-border">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-[#004cff] text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-[#004cff] text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-accent"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "approved"
                  ? "bg-[#004cff] text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-accent"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "rejected"
                  ? "bg-[#004cff] text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-accent"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* KYC Requests Table */}
      <div className="overflow-hidden border rounded-lg bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  User ID
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Type
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Document
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Submitted
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-left text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-border hover:bg-accent/50"
                >
                  <td className="p-4 font-mono text-sm text-foreground">
                    {request.userId}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {request.userName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs font-medium capitalize rounded-full bg-primary/10 text-primary">
                      {request.userType}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {request.documentType}
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {request.submittedDate}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        request.status === "approved"
                          ? "bg-green-500/20 text-green-700"
                          : request.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-700"
                          : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-[#004cff] text-primary-foreground hover:bg-[#004cff]/90"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <Shield size={48} className="mx-auto mb-4 opacity-50" />
          <p>No KYC requests found</p>
        </div>
      )}

      {/* KYC Details Modal */}
      {selectedKyc && (
        <KycModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          kyc={selectedKyc}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
