"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, BadgeCheck, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { getVendors, type Vendor } from "@/lib/services-api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

export function FeaturedVendors() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      const data = await getVendors({ featured: true, limit: 10 });
      setVendors(data.vendors);
      setLoading(false);
    }
    fetchVendors();
  }, []);

  const checkScroll = () => {
    if (scrollerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    scrollerRef.current?.addEventListener("scroll", checkScroll);
    return () => scrollerRef.current?.removeEventListener("scroll", checkScroll);
  }, [vendors]);

  function scrollByX(dir: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = 340;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="flex gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[300px]">
                <Skeleton className="h-44 rounded-xl" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vendors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Top Rated Services
            </h2>
            <p className="text-neutral-600 mt-1">
              Handpicked vendors with excellent reviews
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollByX("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? "border-neutral-300 hover:bg-neutral-100 text-neutral-700" 
                  : "border-neutral-200 text-neutral-300 cursor-not-allowed"
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByX("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight 
                  ? "border-neutral-300 hover:bg-neutral-100 text-neutral-700" 
                  : "border-neutral-200 text-neutral-300 cursor-not-allowed"
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {vendors.map((vendor, index) => (
              <FeaturedVendorCard key={vendor.id} vendor={vendor} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedVendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const priceRangeLabels: Record<string, string> = {
    BUDGET: "₹",
    MODERATE: "₹₹",
    PREMIUM: "₹₹₹",
    LUXURY: "₹₹₹₹",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="min-w-[300px] max-w-[300px]"
    >
      <Link href={`/services/vendor/${vendor.slug}`}>
        <article className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
          <div className="relative h-44 overflow-hidden bg-neutral-100">
            <Image
              src={vendor.coverImage || "/icons/placeholder.jpg"}
              alt={vendor.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-green-700 text-xs font-medium shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-neutral-900">{vendor.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(`https://wa.me/${vendor.whatsappNumber}`, "_blank");
              }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              title="Contact on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 truncate group-hover:text-[var(--color-brand)] transition-colors">
                  {vendor.name}
                </h3>
                <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{vendor.location.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <span className="text-sm text-neutral-500">
                {vendor.category.name}
              </span>
              <span className="text-sm font-medium text-[var(--color-brand)]">
                {priceRangeLabels[vendor.priceRange]}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
