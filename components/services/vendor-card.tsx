"use client";

import { motion } from "framer-motion";
import { Star, BadgeCheck, MessageCircle, MapPin } from "lucide-react";
import { type Vendor } from "@/lib/services-api";
import Image from "next/image";
import Link from "next/link";

interface VendorCardProps {
  vendor: Vendor;
  index?: number;
}

const priceRangeLabels: Record<string, string> = {
  BUDGET: "Budget",
  MODERATE: "Moderate",
  PREMIUM: "Premium",
  LUXURY: "Luxury",
};

const priceRangeColors: Record<string, string> = {
  BUDGET: "bg-green-100 text-green-700",
  MODERATE: "bg-blue-100 text-blue-700",
  PREMIUM: "bg-purple-100 text-purple-700",
  LUXURY: "bg-amber-100 text-amber-700",
};

export function VendorCard({ vendor, index = 0 }: VendorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/services/vendor/${vendor.slug}`}>
        <article className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-[var(--color-brand)]/5 hover:border-[var(--color-brand)]/20 transition-all duration-300 h-full">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={vendor.coverImage || "/icons/placeholder.jpg"}
              alt={vendor.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium backdrop-blur-sm">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              {vendor.isFeatured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm">
                  Featured
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://wa.me/${vendor.whatsappNumber}`, "_blank");
              }}
              className="absolute bottom-3 right-3 p-2.5 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200"
              title="Contact on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
              <MapPin className="w-3 h-3" />
              {vendor.location.name}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {vendor.category.name}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priceRangeColors[vendor.priceRange]}`}>
                {priceRangeLabels[vendor.priceRange]}
              </span>
            </div>

            <h3 className="font-semibold text-foreground group-hover:text-[var(--color-brand)] transition-colors line-clamp-1 text-lg">
              {vendor.name}
            </h3>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {vendor.shortDescription}
            </p>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{vendor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({vendor.reviewCount} reviews)
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
