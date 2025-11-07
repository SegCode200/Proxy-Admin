import { X, Check, XCircle, FileText } from "lucide-react";
import { useGetOneRider } from "@/hooks/useHook";
import { useState } from "react";

interface RiderDetailsModalProps {
  riderId: string;
  onClose: () => void;
}

export function RiderDetailsModal({
  riderId,
  onClose,
}: RiderDetailsModalProps) {
  const { data, isLoading, error, mutate } = useGetOneRider(riderId);
  const rider = data?.data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isKycRejecting, setIsKycRejecting] = useState(false);
  const [kycRejectionReason, setKycRejectionReason] = useState("");

  const handleKycReject = async () => {
    if (!kycRejectionReason.trim()) {
      setActionStatus({
        type: "error",
        message: "Please provide a reason for KYC rejection",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setActionStatus(null);
      // TODO: Call your API to reject KYC with kycRejectionReason
      // await rejectKyc(riderId, kycRejectionReason);
      setActionStatus({
        type: "success",
        message: "KYC rejected successfully",
      });
      mutate(); // Refresh rider data
      setIsKycRejecting(false);
      setKycRejectionReason("");
    } catch (err) {
      setActionStatus({ type: "error", message: "Failed to reject KYC" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setActionStatus(null);
      // TODO: Call your API to approve the rider
      // await approveRider(riderId);
      setActionStatus({
        type: "success",
        message: "Rider approved successfully",
      });
      mutate(); // Refresh rider data
    } catch (err) {
      setActionStatus({ type: "error", message: "Failed to approve rider" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setActionStatus({
        type: "error",
        message: "Please provide a reason for rejection",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setActionStatus(null);
      // TODO: Call your API to reject the rider with rejectionReason
      // await rejectRider(riderId, rejectionReason);
      setActionStatus({
        type: "success",
        message: "Rider rejected successfully",
      });
      mutate(); // Refresh rider data
      setIsRejecting(false);
      setRejectionReason("");
    } catch (err) {
      setActionStatus({ type: "error", message: "Failed to reject rider" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Loading rider details...</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004CFF]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="py-4 text-red-500">
            Failed to load rider details: {error.message}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Rider Not Found</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="py-4 text-gray-600">
            The requested rider could not be found.
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Rider Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 text-gray-900">{rider.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="mt-1 text-gray-900">{rider.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">
                  {rider.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="mt-1 text-gray-900">
                  {rider.dateOfBirth
                    ? new Date(rider.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rider.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : rider.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : rider.status === "SUSPENDED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {rider.status || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Seen</p>
                <p className="mt-1 text-gray-900">
                  {rider.lastSeenAt ? formatDate(rider.lastSeenAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Vehicle Information
            </h3>
            {rider?.vehicle ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="mt-1 text-gray-900">
                      {rider.vehicleType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plate Number</p>
                    <p className="mt-1 text-gray-900">
                      {rider.vehicle.plateNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="mt-1 text-gray-900">
                      {rider.vehicle.brand || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="mt-1 text-gray-900">
                      {rider.vehicle.model || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Vehicle Images
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {rider.vehicle.frontViewUrl && (
                      <a
                        href={rider.vehicle.frontViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Front View
                      </a>
                    )}
                    {rider.vehicle.backViewUrl && (
                      <a
                        href={rider.vehicle.backViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Back View
                      </a>
                    )}
                    {rider.vehicle.documentUrl && (
                      <a
                        href={rider.vehicle.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Document
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No vehicle information available
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Statistics
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">Total Deliveries</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {rider.deliveries?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center mt-1">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      rider.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-gray-900">
                    {rider.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="mt-1 text-gray-900">
                  {rider.createdAt ? formatDate(rider.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* KYC Information */}
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                KYC Information
              </h3>
              {rider?.kyc?.status === "PENDING" && (
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FileText className="mr-1.5 h-4 w-4" />
                  Review KYC
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">KYC Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rider?.kyc?.status === "VERIFIED"
                          ? "bg-green-100 text-green-800"
                          : rider?.kyc?.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : rider?.kyc?.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rider?.kyc?.status || "NOT_SUBMITTED"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {rider?.kyc?.createdAt
                      ? formatDate(rider.kyc.createdAt)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {rider?.kyc && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">ID Type</p>
                    <p className="mt-1 text-gray-900">
                      {rider.kyc.idType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NIN Number</p>
                    <p className="mt-1 text-gray-900">
                      {rider.kyc.ninNumber || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {rider?.kyc && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Documents
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {rider.kyc.selfieUrl && (
                      <a
                        href={rider.kyc.selfieUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Selfie
                      </a>
                    )}
                    {rider.kyc.idCardUrl && (
                      <a
                        href={rider.kyc.idCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View ID Card
                      </a>
                    )}
                    {rider.kyc.licenseUrl && (
                      <a
                        href={rider.kyc.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View License
                      </a>
                    )}
                    {rider.kyc.roadWorthinessUrl && (
                      <a
                        href={rider.kyc.roadWorthinessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 text-sm text-blue-600 transition-colors bg-white border border-gray-200 rounded-md hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Road Worthiness
                      </a>
                    )}
                  </div>
                </div>
              )}

              {rider?.kycRejectionReason && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="p-2 mt-1 text-sm text-gray-700 rounded bg-red-50">
                    {rider.kycRejectionReason}
                  </p>
                </div>
              )}

              {rider?.kyc?.status === "PENDING" ? (
                <div className="flex justify-center space-x-3">
                  {!isKycRejecting ? (
                    <>
                      <button
                        onClick={() => setIsKycRejecting(true)}
                        className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                        disabled={isSubmitting}
                      >
                        Reject KYC
                      </button>
                      <button
                        onClick={handleApprove}
                        className="px-4 py-2 text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Approving..." : "Approve KYC"}
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div>
                        <label
                          htmlFor="kycRejectionReason"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Reason for KYC Rejection
                        </label>
                        <textarea
                          id="kycRejectionReason"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Please provide a reason for KYC rejection..."
                          value={kycRejectionReason}
                          onChange={(e) =>
                            setKycRejectionReason(e.target.value)
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setIsKycRejecting(false);
                            setKycRejectionReason("");
                            setActionStatus(null);
                          }}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleKycReject}
                          className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                          disabled={isSubmitting || !kycRejectionReason.trim()}
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit KYC Rejection"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {actionStatus && (
          <div
            className={`mt-4 p-3 rounded-md ${
              actionStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {actionStatus.type === "success" ? (
                <Check className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
              )}
              <span className="text-sm">{actionStatus.message}</span>
            </div>
          </div>
        )}

        {rider?.status === "PENDING" && (
          <div className="pt-4 mt-6 border-t border-gray-200">
            {!isRejecting ? (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Close
                </button>
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Approving..." : "Approve"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="rejectionReason"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Reason for Rejection
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsRejecting(false);
                      setRejectionReason("");
                      setActionStatus(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                    disabled={isSubmitting || !rejectionReason.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Rejection"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {rider?.status !== "PENDING" && (
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
