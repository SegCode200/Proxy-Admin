"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  X,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { useUpdateKycStatus } from "@/hooks/useHook";
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

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  kyc: KycRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function KycModal({
  isOpen,
  onClose,
  kyc,
  onApprove,
  onReject,
}: KycModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const token = useSelector(selectUser)?.token;
  const { updateStatus, isUpdating } = useUpdateKycStatus();

  if (!isOpen) return null;

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleApprove = async () => {
    if (!token) return;

    try {
      await updateStatus(kyc.id, "APPROVED", token);
      onApprove(kyc.id); // Call parent callback to refresh data
      onClose();
    } catch (error) {
      console.error("Failed to approve KYC request:", error);
    }
  };

  const handleReject = async () => {
    if (!token) return;

    try {
      await updateStatus(kyc.id, "REJECTED", token);
      onReject(kyc.id); // Call parent callback to refresh data
      onClose();
    } catch (error) {
      console.error("Failed to reject KYC request:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-card border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              KYC Verification Details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review user identity documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-accent text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="p-6 space-y-4 rounded-lg bg-muted/50">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              User Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium text-foreground">{kyc.userName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono font-medium text-foreground">
                    {kyc.userId}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{kyc.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{kyc.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Submitted Date
                  </p>
                  <p className="font-medium text-foreground">
                    {kyc.submittedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="p-6 rounded-lg bg-muted/50">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Document Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="font-medium text-foreground">
                  {kyc.documentType}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Number</p>
                <p className="font-mono font-medium text-foreground">
                  {kyc.idNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <span className="inline-block px-3 py-1 text-xs font-medium capitalize rounded-full bg-primary/10 text-primary">
                  {kyc.userType}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    kyc.status === "approved"
                      ? "bg-green-500/20 text-green-700"
                      : kyc.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-700"
                      : "bg-red-500/20 text-red-700"
                  }`}
                >
                  {kyc.status}
                </span>
              </div>
            </div>
          </div>

          {/* Document Images */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Submitted Documents
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {kyc.documents.idFront && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    ID Front
                  </p>
                  <div
                    className="relative overflow-hidden rounded-lg cursor-pointer bg-muted aspect-video group"
                    onClick={() => openImageModal(kyc.documents.idFront)}
                  >
                    <img
                      src={kyc.documents.idFront}
                      alt="ID Front"
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              )}
              {kyc.documents.selfie && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Selfie with ID
                  </p>
                  <div
                    className="relative overflow-hidden rounded-lg cursor-pointer bg-muted aspect-video group"
                    onClick={() => openImageModal(kyc.documents.selfie)}
                  >
                    <img
                      src={kyc.documents.selfie}
                      alt="Selfie"
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {kyc.status === "pending" && (
            <div className="flex gap-4 pt-6 border-t border-border">
              <button
                onClick={handleApprove}
                disabled={isUpdating}
                className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {isUpdating ? "Approving..." : "Approve KYC"}
              </button>
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <XCircle size={20} />
                )}
                {isUpdating ? "Rejecting..." : "Reject KYC"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black"
            onClick={closeImageModal}
          />
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeImageModal}
              className="absolute z-10 p-2 text-white transition-colors rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Full size document"
              className="object-contain w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
