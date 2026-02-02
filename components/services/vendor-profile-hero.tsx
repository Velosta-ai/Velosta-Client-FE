"use client";

import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Globe, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { type Vendor } from "@/lib/services-api";

interface VendorProfileHeroProps {
  vendor: Vendor;
}

const priceRangeLabels: Record<string, string> = {
  BUDGET: "Budget Friendly",
  MODERATE: "Moderate",
  PREMIUM: "Premium",
  LUXURY: "Luxury",
};

export function VendorProfileHero({ vendor }: VendorProfileHeroProps) {
  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={vendor.coverImage || "/icons/placeholder.jpg"}
          alt={vendor.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative -mt-24 bg-card rounded-2xl border border-border/50 shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-lg">
                <Image
                  src={vendor.logo || "/icons/placeholder-logo.png"}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-2">
                {vendor.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {vendor.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                    Featured
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  {vendor.category.name}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {vendor.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {vendor.location.name}, {vendor.location.state}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{vendor.rating}</span>
                  <span>({vendor.reviewCount} reviews)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-muted">
                  {priceRangeLabels[vendor.priceRange]}
                </span>
              </div>

              <p className="text-muted-foreground line-clamp-2 md:line-clamp-none">
                {vendor.shortDescription}
              </p>
            </div>

            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                >
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Website</span>
                </a>
              )}
              {vendor.email && (
                <a
                  href={`mailto:${vendor.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Email</span>
                </a>
              )}
              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{vendor.phone}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
