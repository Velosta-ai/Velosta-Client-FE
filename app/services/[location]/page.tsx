"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  ChevronRight,
  Clock,
  Camera,
  Star,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getLocations,
  getCategories,
  getVendors,
  type Location,
  type ServiceCategory,
  type Vendor,
} from "@/lib/services-api";

// Price range config
const priceRangeLabels: Record<string, string> = {
  BUDGET: "Budget",
  MODERATE: "Moderate",
  PREMIUM: "Premium",
  LUXURY: "Luxury",
};

// Sort options
type SortOption = "recommended" | "price_low" | "rating" | "reviews";

export default function LocationVendorsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locationSlug = params.location as string;
  const categoryFromUrl = searchParams.get("category");

  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [locationsData, categoriesData, vendorsData] = await Promise.all([
          getLocations(),
          getCategories(),
          getVendors({ locationSlug, limit: 100 }),
        ]);

        const foundLocation = locationsData.find((l) => l.slug === locationSlug);
        setLocation(foundLocation || null);
        setCategories(categoriesData);
        setVendors(vendorsData.vendors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [locationSlug]);

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((v) => selectedCategories.includes(v.category.slug));
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((v) => selectedPriceRanges.includes(v.priceRange));
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter((v) => v.isVerified);
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        const priceOrder = ["BUDGET", "MODERATE", "PREMIUM", "LUXURY"];
        result.sort(
          (a, b) => priceOrder.indexOf(a.priceRange) - priceOrder.indexOf(b.priceRange)
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }

    return result;
  }, [vendors, selectedCategories, selectedPriceRanges, verifiedOnly, sortBy]);

  // Get categories available in this location
  const locationCategories = useMemo(() => {
    const vendorCategories = new Set(vendors.map((v) => v.category.slug));
    return categories.filter((c) => vendorCategories.has(c.slug));
  }, [vendors, categories]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const togglePriceRange = (value: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedLocations([]);
    setVerifiedOnly(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedLocations.length > 0 ||
    verifiedOnly;

  const selectedCategoryName =
    selectedCategories.length === 1
      ? categories.find((c) => c.slug === selectedCategories[0])?.name
      : null;

  if (!isLoading && !location) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
              Location Not Found
            </h1>
            <p className="text-neutral-500 mb-4">
              We couldn&apos;t find services for this location.
            </p>
            <Button asChild>
              <Link href="/services">Browse All Locations</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-orange-50/30 mt-10">
      <Navbar />

      <div className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/services"
              className="text-neutral-500 hover:text-orange-600 transition-colors"
            >
              Services
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-700 font-medium">
              {location?.name || "Loading..."}
            </span>
            {selectedCategoryName && (
              <>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-700 font-medium">
                  {selectedCategoryName}
                </span>
              </>
            )}
          </nav>

          <div className="flex gap-8">
            {/* Left Sidebar Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Filter Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                  <h3 className="font-semibold text-neutral-900 mb-5">Filter by</h3>

                  {/* Category Filter */}
                  {locationCategories.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-neutral-100">
                      <h4 className="font-medium text-neutral-800 mb-3 text-sm">
                        Service Type
                      </h4>
                      <div className="space-y-3">
                        {locationCategories.map((category) => (
                          <label
                            key={category.slug}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <Checkbox
                              checked={selectedCategories.includes(category.slug)}
                              onCheckedChange={() => toggleCategory(category.slug)}
                              className="border-neutral-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range Filter */}
                  <div className="mb-6 pb-6 border-b border-neutral-100">
                    <h4 className="font-medium text-neutral-800 mb-3 text-sm">
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(priceRangeLabels).map(([value, label]) => (
                        <label
                          key={value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedPriceRanges.includes(value)}
                            onCheckedChange={() => togglePriceRange(value)}
                            className="border-neutral-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verified Filter */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-3 text-sm">
                      Verification
                    </h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        checked={verifiedOnly}
                        onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                        className="border-neutral-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                        Verified Partners Only
                      </span>
                    </label>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-5 w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* Help CTA Card */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Need help choosing?
                  </h4>
                  <p className="text-orange-800/80 text-sm mb-4">
                    Our local experts can help you find the best service for your trip.
                  </p>
                  <Link
                    href="/velosta-ai"
                    className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Chat with us <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                    {selectedCategoryName || "Services"} in {location?.name || "..."}
                  </h1>
                  <p className="text-neutral-500 mt-1">
                    Showing {filteredVendors.length} vendor
                    {filteredVendors.length !== 1 ? "s" : ""}
                    {vendors.length > 0 && filteredVendors.length !== vendors.length
                      ? ` of ${vendors.length}`
                      : ""}
                  </p>
                </div>

                {/* Sort Tabs */}
                <div className="flex items-center gap-1 bg-white rounded-full border border-neutral-200 p-1">
                  {[
                    { value: "recommended", label: "Recommended" },
                    { value: "price_low", label: "Lowest Price" },
                    { value: "rating", label: "Top Rated" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        sortBy === option.value
                          ? "bg-orange-500 text-white"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vendor List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse"
                    >
                      <div className="flex gap-5">
                        <div className="w-52 h-40 bg-neutral-200 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-neutral-200 rounded w-1/3" />
                          <div className="h-4 bg-neutral-200 rounded w-1/4" />
                          <div className="h-4 bg-neutral-200 rounded w-1/2" />
                          <div className="flex gap-2 mt-4">
                            <div className="h-6 bg-neutral-200 rounded-full w-20" />
                            <div className="h-6 bg-neutral-200 rounded-full w-24" />
                          </div>
                        </div>
                        <div className="w-36 space-y-3">
                          <div className="h-8 bg-neutral-200 rounded w-full" />
                          <div className="h-10 bg-neutral-200 rounded-lg w-full" />
                          <div className="h-10 bg-neutral-200 rounded-lg w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredVendors.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sortBy + selectedCategories.join()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {filteredVendors.map((vendor, index) => (
                      <VendorCard key={vendor.id} vendor={vendor} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No vendors found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {vendors.length === 0
                      ? "No services available in this location yet."
                      : "Try adjusting your filters"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Rating helper
function getRatingLabel(rating: number) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  return "Average";
}

// Vendor Card Component
function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <article className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <Link
            href={`/services/vendor/${vendor.slug}`}
            className="relative w-full md:w-52 h-48 md:h-44 shrink-0"
          >
            <Image
              src={vendor.coverImage || "/icons/placeholder.jpg"}
              alt={vendor.name}
              fill
              className="object-cover"
            />
            {/* Photo count badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              <Camera className="w-3.5 h-3.5" />
              <span>Photos</span>
            </div>
            {/* Top Rated / Low Price badges */}
            {vendor.rating >= 4.5 && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-orange-500 text-white text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Top Rated
              </div>
            )}
            {vendor.priceRange === "BUDGET" && vendor.rating < 4.5 && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-green-600 text-white text-xs font-medium">
                Low Price Deal
              </div>
            )}
          </Link>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row gap-4">
            {/* Main Info */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-start gap-2 mb-2">
                <Link href={`/services/vendor/${vendor.slug}`}>
                  <h3 className="text-lg font-semibold text-neutral-900 hover:text-orange-600 transition-colors">
                    {vendor.name}
                  </h3>
                </Link>
                {vendor.isFeatured && (
                  <span className="shrink-0 px-2 py-0.5 rounded border border-orange-200 bg-orange-50 text-orange-600 text-xs font-medium">
                    Top Rated
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-6 rounded bg-green-600 text-white text-sm font-bold">
                  {vendor.rating}
                </span>
                <span className="text-sm font-medium text-neutral-700">
                  {getRatingLabel(vendor.rating)}
                </span>
                <span className="text-sm text-neutral-500">
                  • {vendor.reviewCount} reviews
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  {vendor.location.name}
                </span>
                <button className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                  Show on map
                </button>
              </div>

              {/* Verified Badge */}
              {vendor.isVerified && (
                <div className="flex items-center gap-1.5 text-sm text-green-700 mb-3">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Verified Partner</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium">
                  {vendor.category.name}
                </span>
                {vendor.shortDescription && (
                  <span className="px-3 py-1 rounded-md bg-neutral-100 text-neutral-600 text-xs">
                    {vendor.shortDescription.split(" ").slice(0, 4).join(" ")}
                    {vendor.shortDescription.split(" ").length > 4 ? "..." : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="md:w-40 shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
              {/* Price */}
              <div className="text-right">
                <p className="text-xs text-neutral-500">Starting from</p>
                <p className="text-xl font-bold text-orange-600">
                  {vendor.priceRange === "BUDGET" && "₹200"}
                  {vendor.priceRange === "MODERATE" && "₹500"}
                  {vendor.priceRange === "PREMIUM" && "₹1,000"}
                  {vendor.priceRange === "LUXURY" && "₹2,500"}
                  <span className="text-sm font-normal text-neutral-500"> / day</span>
                </p>
                {vendor.priceRange === "BUDGET" && (
                  <p className="text-xs text-green-600 font-medium">Free cancellation</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex md:flex-col gap-2 w-full md:mt-3">
                <Link
                  href={`/services/vendor/${vendor.slug}`}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium text-center transition-colors"
                >
                  View Details
                </Link>
                {/* <button
                  onClick={() =>
                    window.open(`https://wa.me/${vendor.whatsappNumber}`, "_blank")
                  }
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Vendor
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
