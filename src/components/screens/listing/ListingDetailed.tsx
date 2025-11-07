"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  seller: string;
  sellerImage: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  specifications: Record<string, string>;
  image: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  stock: number;
  inStock: boolean;
  seller_email: string;
  seller_phone: string;
  seller_location: string;
  seller_website?: string;
  submittedDate: string;
}

const productData: Record<string, ProductDetail> = {
  "1": {
    id: "1",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    seller: "TechStore Pro",
    sellerImage: "/seller-avatar.png",
    price: 149.99,
    rating: 0,
    reviews: 0,
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort for extended listening sessions.",
    specifications: {
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      "Noise Cancellation": "Active (ANC)",
      "Driver Size": "40mm",
      Weight: "250g",
      Warranty: "2 years",
    },
    image: "/wireless-headphones.png",
    images: ["/wireless-headphones.png"],
    status: "pending",
    stock: 45,
    inStock: true,
    seller_email: "support@techstorepro.com",
    seller_phone: "+1 (555) 123-4567",
    seller_location: "New York, NY",
    seller_website: "www.techstorepro.com",
    submittedDate: "2024-01-15",
  },
  "2": {
    id: "2",
    name: "Organic Coffee Beans",
    category: "Food & Beverages",
    seller: "Coffee Masters",
    sellerImage: "/cozy-corner-cafe.png",
    price: 24.99,
    rating: 0,
    reviews: 0,
    description:
      "Premium single-origin coffee beans sourced directly from Ethiopian highlands. Medium roast with notes of blueberry and chocolate. Perfect for espresso or pour-over.",
    specifications: {
      Origin: "Ethiopia - Yirgacheffe",
      Roast: "Medium",
      "Bag Size": "1 lb (454g)",
      "Flavor Profile": "Blueberry, Chocolate, Floral",
      Processing: "Washed",
    },
    image: "/pile-of-coffee-beans.png",
    images: ["/pile-of-coffee-beans.png"],
    status: "pending",
    stock: 120,
    inStock: true,
    seller_email: "info@coffeemasters.com",
    seller_phone: "+1 (555) 987-6543",
    seller_location: "Seattle, WA",
    submittedDate: "2024-01-14",
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  //   const router = useNavigate();
  const productId = params.id as string;
  const [product, setProduct] = useState<ProductDetail | null>(
    productData[productId] || null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) {
    return (
      <div className="flex-1 p-8">
        <Link
          to="/listings"
          className="flex items-center gap-2 mb-8 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </Link>
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProduct({ ...product, status: "approved" });
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProduct({ ...product, status: "rejected" });
    setIsProcessing(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Back Button */}
        <Link
          to="/listings"
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
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right - Product Details & Approval */}
          <div className="space-y-6">
            {/* Category & Status */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {product.category}
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {product.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    product.status === "approved"
                      ? "bg-green-500/20 text-green-700"
                      : product.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-700"
                      : "bg-red-500/20 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Submitted Date */}
            <div className="p-4 border rounded-lg bg-card border-border">
              <p className="mb-1 text-sm text-muted-foreground">
                Submitted Date
              </p>
              <p className="font-semibold text-foreground">
                {product.submittedDate}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <span className="text-4xl font-bold text-primary">
                ${product.price}
              </span>
            </div>

            {/* Stock Status */}
            <div
              className={`p-4 rounded-lg ${
                product.inStock ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              <p
                className={
                  product.inStock
                    ? "text-green-700 font-medium"
                    : "text-red-700 font-medium"
                }
              >
                {product.inStock
                  ? `In Stock (${product.stock} units)`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Approval Actions - Added approve/reject buttons */}
            {product.status === "pending" ? (
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
                    product.status === "approved"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {product.status === "approved" ? "✓ Approved" : "✗ Rejected"}
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

        {/* Specifications */}
        <div className="pt-8 mt-12 border-t border-border">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="p-4 border rounded-lg bg-card border-border"
              >
                <p className="mb-1 text-sm text-muted-foreground">{key}</p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
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
                src={product.sellerImage || "/placeholder.svg"}
                alt={product.seller}
                className="object-cover w-16 h-16 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {product.seller}
                </h3>
                <p className="text-sm text-muted-foreground">Seller Account</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <MapPin size={18} className="text-primary" />
                <span>{product.seller_location}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={18} className="text-primary" />
                <a
                  href={`mailto:${product.seller_email}`}
                  className="hover:underline"
                >
                  {product.seller_email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Phone size={18} className="text-primary" />
                <a
                  href={`tel:${product.seller_phone}`}
                  className="hover:underline"
                >
                  {product.seller_phone}
                </a>
              </div>
              {product.seller_website && (
                <div className="flex items-center gap-3 text-foreground">
                  <Globe size={18} className="text-primary" />
                  <a
                    href={`https://${product.seller_website}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.seller_website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
