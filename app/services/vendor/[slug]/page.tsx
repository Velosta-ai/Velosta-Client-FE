"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { VendorProfileHero } from "@/components/services/vendor-profile-hero";
import { VendorGallery } from "@/components/services/vendor-gallery";
import { VendorContactSection } from "@/components/services/vendor-contact-section";
import { VendorCatalogue } from "@/components/services/vendor-catalogue";
import { VendorMap } from "@/components/services/vendor-map";
import { VendorCard } from "@/components/services/vendor-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getVendorBySlug, getRelatedVendors, type Vendor } from "@/lib/services-api";

function VendorProfileSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      <Skeleton className="h-64 md:h-80 lg:h-96 w-full rounded-none" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative -mt-24 bg-card rounded-2xl border border-border/50 shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [relatedVendors, setRelatedVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const vendorData = await getVendorBySlug(slug);
        setVendor(vendorData);
        
        if (vendorData) {
          const relatedData = await getRelatedVendors(slug, 4);
          setRelatedVendors(relatedData);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <VendorProfileSkeleton />
        <Footer />
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Vendor Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t find this vendor. They may have been removed.
            </p>
            <Button asChild>
              <Link href="/services">Browse Services</Link>
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

      <div className="fixed top-24 left-6 z-30">
        <Link
          href={`/services/${vendor.location.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {vendor.location.name}
        </Link>
      </div>

      <div className="pt-16">
        <VendorProfileHero vendor={vendor} />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                About
              </h2>
              <div className="prose prose-neutral max-w-none">
                {vendor.description.split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">
                        {paragraph.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="text-muted-foreground ml-4">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  return paragraph ? (
                    <p key={index} className="text-muted-foreground mb-3">
                      {paragraph}
                    </p>
                  ) : null;
                })}
              </div>
            </motion.section>

            {vendor.images && vendor.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <VendorGallery images={vendor.images} vendorName={vendor.name} />
              </motion.div>
            )}

            {vendor.catalogue && vendor.catalogue.headers && vendor.catalogue.rows && vendor.catalogue.rows.length > 0 && (
              <VendorCatalogue 
                catalogue={vendor.catalogue} 
                catalogueName={vendor.catalogueName} 
              />
            )}

            {vendor.latitude && vendor.longitude ? (
              <VendorMap
                latitude={vendor.latitude}
                longitude={vendor.longitude}
                address={vendor.address || `${vendor.location.name}, ${vendor.location.state}`}
                vendorName={vendor.name}
              />
            ) : (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Location
                </h2>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{vendor.address || "Contact for address"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vendor.location.name}, {vendor.location.state}
                    </p>
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1">
            <VendorContactSection vendor={vendor} />
          </div>
        </div>

        {relatedVendors.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Similar Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVendors.map((relatedVendor, index) => (
                <VendorCard
                  key={relatedVendor.id}
                  vendor={relatedVendor}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <Footer />
    </main>
  );
}
