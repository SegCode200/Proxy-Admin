"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetProductById } from "@/hooks/useHook";
import { selectUser } from "@/store/authSlice";
import { approveListing, rejectListing, removeListing } from "@/apis/listing";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { product, isLoading, error, mutate } = useGetProductById(id as string);
  const token = useSelector(selectUser)?.token;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const mediaItems = product?.media || [];
  const hasMultipleImages = mediaItems.length > 1;

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <Link
          to="/listing"
          className="flex items-center gap-2 mb-8 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </Link>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-[#004CFF] animate-spin mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 p-8">
        <Link
          to="/listing"
          className="flex items-center gap-2 mb-8 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </Link>
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            {error ? "Failed to load product" : "Product not found"}
          </p>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!token) return;
    setIsProcessing(true);
    try {
      await approveListing(id!, token);
      mutate(); // Refetch data
    } catch (error) {
      console.error("Failed to approve listing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!token || !rejectNote.trim()) return;
    setIsProcessing(true);
    try {
      await rejectListing(id!, rejectNote, token);
      mutate(); // Refetch data
      setRejectDialogOpen(false);
      setRejectNote("");
    } catch (error) {
      console.error("Failed to reject listing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (!token) return;
    setIsProcessing(true);
    try {
      await removeListing(id!, token);
      mutate(); // Refetch data
    } catch (error) {
      console.error("Failed to remove listing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Back Button */}
        <Link
          to="/listing"
          className="flex items-center gap-2 mb-8 text-primary hover:underline w-fit"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left - Product Images */}
          <div className="lg:col-span-2">
            {/* Main Image Display */}
            <div className="relative mb-4 overflow-hidden rounded-lg bg-secondary h-96">
              <img
                src={mediaItems[selectedImageIndex]?.url || "/placeholder.svg"}
                alt={product.title}
                className="object-cover w-full h-full"
              />

              {/* Navigation Arrows - only show if multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? mediaItems.length - 1 : prev - 1
                      )
                    }
                    className="absolute p-2 text-white transition-colors -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === mediaItems.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute p-2 text-white transition-colors -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {mediaItems.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={`${product.title} ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Details & Approval */}
          <div className="space-y-6">
            {/* Category & Status */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {product.extraDetails?.[0]?.title || "No Category"}
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {product.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    product.status === "APPROVED"
                      ? "bg-green-500/20 text-green-700"
                      : product.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-700"
                      : "bg-red-500/20 text-red-700"
                  }`}
                >
                  {product.status?.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Submitted Date */}
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">
                Submitted Date
              </p>
              <p className="font-semibold text-foreground">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <span className="text-4xl font-bold text-primary">
                {product.currency} {product.price?.toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div
              className={`p-4 rounded-lg ${
                (product.stock ?? 0) > 0 ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              <p
                className={
                  (product.stock ?? 0) > 0
                    ? "text-green-700 font-medium"
                    : "text-red-700 font-medium"
                }
              >
                {(product.stock ?? 0) > 0
                  ? `In Stock (${product.stock} units)`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Approval Actions */}
            <div className="pt-4 space-y-3 border-t border-border">
              {product.status === "PENDING" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle size={20} />
                    Approve Product
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle size={20} />
                    Reject Product
                  </button>
                </>
              )}
              <button
                onClick={handleRemove}
                disabled={isProcessing}
                className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <Trash2 size={20} />
                Remove Listing
              </button>
              {product.status !== "PENDING" && (
                <div className="p-4 border rounded-lg bg-card border-border">
                  <p className="mb-1 text-sm text-muted-foreground">
                    Decision Status
                  </p>
                  <p
                    className={`font-semibold capitalize ${
                      product.status === "APPROVED"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {product.status === "APPROVED"
                      ? "✓ Approved"
                      : "✗ Rejected"}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-border">
              <h3 className="mb-2 font-semibold text-foreground">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="pt-8 mt-12 border-t border-border">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Product Details
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">Condition</p>
              <p className="font-semibold capitalize text-foreground">
                {product.condition}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">Type</p>
              <p className="font-semibold text-foreground">
                {product.isDigital ? "Digital" : "Physical"}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">Stock</p>
              <p className="font-semibold text-foreground">
                {product.stock} units
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">Category ID</p>
              <p className="font-semibold text-foreground">
                {product.categoryId}
              </p>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="pt-8 mt-12 border-t border-border">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Seller Information
          </h2>
          <div className="p-6 border rounded-lg bg-card border-border">
            <div className="flex items-start gap-4 mb-6">
              <img
                src="/placeholder.svg"
                alt={product.seller.name}
                className="object-cover w-16 h-16 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {product.seller.name}
                </h3>
                <p className="text-sm text-muted-foreground">Seller Account</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={18} className="text-primary" />
                <a
                  href={`mailto:${product.seller.email}`}
                  className="hover:underline"
                >
                  {product.seller.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this listing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectNote.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
