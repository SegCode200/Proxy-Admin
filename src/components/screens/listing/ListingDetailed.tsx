"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useGetProductById } from "@/hooks/useHook";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { product, isLoading, error } = useGetProductById(id as string);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    // TODO: Implement actual approve API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // For now, just simulate - in real implementation, refetch data
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    // TODO: Implement actual reject API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // For now, just simulate - in real implementation, refetch data
    setIsProcessing(false);
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
            <div className="mb-4 overflow-hidden rounded-lg bg-secondary h-96">
              <img
                src={product.media?.[0]?.url || "/placeholder.svg"}
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
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

            {/* Approval Actions - Added approve/reject buttons */}
            {product.status === "PENDING" ? (
              <div className="pt-4 space-y-3 border-t border-border">
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
              </div>
            ) : (
              <div className="p-4 pt-4 border-t rounded-lg border-border bg-card">
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
                  {product.status === "APPROVED" ? "✓ Approved" : "✗ Rejected"}
                </p>
              </div>
            )}

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
    </div>
  );
}
