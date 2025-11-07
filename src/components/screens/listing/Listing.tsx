"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import { useAllProduct } from "@/hooks/useHook";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   seller: string;
//   price: number;
//   rating: number;
//   reviews: number;
//   image: string;
//   status: "pending" | "approved" | "rejected";
//   submittedDate: string;
// }

// Use SWR hook to fetch real products
// products array will be populated from the API via the hook

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const token = useSelector((state: RootState) => state?.auth?.user?.token);
  const { products = [], isLoading, error } = useAllProduct(token);
  console.log(products);
  const statuses = ["pending", "approved", "rejected"];
  const filteredProducts = products.filter((product) => {
    const title = String(product?.title ?? "");
    const sellerName = String(product?.seller?.name ?? "");
    const status = String(product?.status ?? "").toLowerCase();

    const q = String(searchTerm ?? "").toLowerCase();
    const matchesSearch =
      title.toLowerCase().includes(q) || sellerName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Product Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and approve/reject product listings from sellers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <div className="p-6 border rounded-lg bg-card border-border">
            <p className="mb-2 text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card border-border">
            <p className="mb-2 text-sm text-muted-foreground">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.approved}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card border-border">
            <p className="mb-2 text-sm text-muted-foreground">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {["all", ...statuses].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 col-span-full">
              <Loader2 className="w-10 h-10 text-[#004CFF] animate-spin mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center col-span-full">
              <p className="text-red-600">Failed to load products</p>
              <p className="mt-1 text-sm text-red-500">
                {(error as any).message}
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/listings/${product.id}`}
                className="overflow-hidden transition-all duration-200 border rounded-lg group bg-card border-border hover:shadow-lg hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-secondary">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === "approved"
                        ? "bg-green-500/20 text-green-700"
                        : product.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : "bg-red-500/20 text-red-700"
                    }`}
                  >
                    {product.status
                      ? product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)
                      : "N/A"}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="mb-1 text-sm text-muted-foreground">
                    {product.extraDetails?.[0]?.title || 'No Category'}
                  </p>
                  <h3 className="mb-2 font-semibold transition-colors text-foreground line-clamp-2 group-hover:text-primary">
                    {product.title}
                  </h3>

                  {/* Seller */}
                  <p className="mb-2 text-sm text-muted-foreground">
                    Seller: {product.seller?.name}
                  </p>

                  {/* Submitted Date */}
                  <p className="mb-3 text-xs text-muted-foreground">
                    Submitted: {new Date(product.createdAt).toLocaleDateString()}
                  </p>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-lg font-bold text-primary">
                      {product.currency} {(product.price ?? 0).toLocaleString()}
                    </div>
                    <div className="p-2 transition-colors rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center col-span-full">
              <p className="text-lg text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
