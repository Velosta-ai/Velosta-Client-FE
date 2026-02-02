"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, ChevronLeft, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { VendorCard } from "@/components/services/vendor-card";
import { VendorGridSkeleton } from "@/components/services/vendor-card-skeleton";
import { ServiceFilters, type FilterState } from "@/components/services/service-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getLocations,
  getCategories,
  getVendors,
  type Location,
  type ServiceCategory,
  type Vendor,
} from "@/lib/services-api";

export default function LocationVendorsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locationSlug = params.location as string;
  const categoryFromUrl = searchParams.get("category");

  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    priceRanges: [],
    minRating: null,
    verified: false,
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [locationsData, categoriesData, vendorsData] = await Promise.all([
          getLocations(),
          getCategories(),
          getVendors({ locationSlug, limit: 100 }),
        ]);

        const foundLocation = locationsData.find(l => l.slug === locationSlug);
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

  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.shortDescription?.toLowerCase().includes(query) ||
          v.category.name.toLowerCase().includes(query)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((v) =>
        filters.categories.includes(v.category.slug)
      );
    }

    if (filters.priceRanges.length > 0) {
      result = result.filter((v) =>
        filters.priceRanges.includes(v.priceRange)
      );
    }

    if (filters.minRating) {
      result = result.filter((v) => v.rating >= filters.minRating!);
    }

    if (filters.verified) {
      result = result.filter((v) => v.isVerified);
    }

    return result;
  }, [vendors, searchQuery, filters]);

  const locationCategories = useMemo(() => {
    const vendorCategories = new Set(vendors.map((v) => v.category.slug));
    return categories.filter((c) => vendorCategories.has(c.slug));
  }, [vendors, categories]);

  if (!isLoading && !location) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Location Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              We couldn't find services for this location.
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
    <main className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />

      <div className="pt-24 pb-8 bg-gradient-to-b from-[var(--color-brand)]/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-foreground">{location?.name || "Loading..."}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[var(--color-brand)]" />
                Services in {location?.name || "Loading..."}
              </h1>
              <p className="text-muted-foreground mt-1">
                {location?.state || ""} • {filteredVendors.length} services available
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setFilters({ ...filters, categories: [] })}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.categories.length === 0
                  ? "bg-[var(--color-brand)] text-white"
                  : "bg-background border border-border hover:border-[var(--color-brand)]/30"
              }`}
            >
              All
            </button>
            {locationCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() =>
                  setFilters({
                    ...filters,
                    categories: filters.categories.includes(category.slug)
                      ? filters.categories.filter((c) => c !== category.slug)
                      : [category.slug],
                  })
                }
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.categories.includes(category.slug)
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-background border border-border hover:border-[var(--color-brand)]/30"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-8">
            <ServiceFilters
              filters={filters}
              onFiltersChange={setFilters}
              showCategoryFilter={false}
            />

            <div className="flex-1">
              {isLoading ? (
                <VendorGridSkeleton count={6} />
              ) : filteredVendors.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={JSON.stringify(filters) + searchQuery}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {filteredVendors.map((vendor, index) => (
                      <VendorCard key={vendor.id} vendor={vendor} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No services found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {vendors.length === 0 
                      ? "No services available in this location yet."
                      : "Try adjusting your filters or search query"}
                  </p>
                  {vendors.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({
                          categories: [],
                          priceRanges: [],
                          minRating: null,
                          verified: false,
                        });
                      }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
