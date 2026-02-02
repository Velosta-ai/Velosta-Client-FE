"use client";

import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ServiceCategoryGrid } from "@/components/services/service-category-grid";
import { getLocations, getVendors, Location, Vendor } from "@/lib/services-api";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, ArrowUpRight, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelectorModal } from "@/components/services/location-selector-modal";

// Hero Section - Editorial style
function HeroSection() {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <>
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-6">
                Trusted by 10,000+ travelers
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight mb-6">
                Discover
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ea580c]">
                  Local Services
                </span>
              </h1>

              <p className="text-xl text-neutral-600 leading-relaxed mb-10 max-w-lg">
                From taxi rides to homestays, connect directly with verified local vendors. 
                No middlemen, no hidden fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Choose Destination
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-neutral-200 text-neutral-700 rounded-full font-medium hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                >
                  Browse Services
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-12 border-t border-neutral-100">
                <div>
                  <div className="text-3xl font-bold text-neutral-900">200+</div>
                  <div className="text-sm text-neutral-500">Verified Vendors</div>
                </div>
                <div className="h-12 w-px bg-neutral-200" />
                <div>
                  <div className="text-3xl font-bold text-neutral-900">15+</div>
                  <div className="text-sm text-neutral-500">Service Types</div>
                </div>
                <div className="h-12 w-px bg-neutral-200" />
                <div>
                  <div className="flex items-center gap-1 text-3xl font-bold text-neutral-900">
                    4.8 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-sm text-neutral-500">Avg Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main image */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                    alt="Travel"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Floating card 1 */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">WhatsApp Direct</div>
                      <div className="text-xs text-neutral-500">No middlemen</div>
                    </div>
                  </div>
                </div>

                {/* Floating card 2 */}
                <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 border-2 border-white" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-neutral-600">+10k</span>
                  </div>
                  <div className="text-xs text-neutral-500">Happy travelers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LocationSelectorModal 
        open={locationModalOpen} 
        onOpenChange={setLocationModalOpen} 
      />
    </>
  );
}

// Services/Categories Section
function ServicesSection() {
  return (
    <section id="explore" className="py-20 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-sm font-medium text-orange-600 tracking-wider uppercase">
                Our Services
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-2">
                What do you need?
              </h2>
            </div>
            <p className="text-neutral-600 max-w-md">
              Browse through our curated list of travel services. All vendors are verified for quality.
            </p>
          </div>
        </motion.div>

        <ServiceCategoryGrid />
      </div>
    </section>
  );
}

// Featured Vendors
function FeaturedSection() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      const data = await getVendors({ featured: true, limit: 4 });
      setVendors(data.vendors);
      setLoading(false);
    }
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-8 w-48 bg-neutral-100 rounded animate-pulse mb-10" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vendors.length === 0) return null;

  const priceLabels: Record<string, string> = {
    BUDGET: "₹", MODERATE: "₹₹", PREMIUM: "₹₹₹", LUXURY: "₹₹₹₹",
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm font-medium text-orange-600 tracking-wider uppercase">
              Top Rated
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-2">
              Featured Services
            </h2>
          </div>
          <Link 
            href="/services/all"
            className="hidden md:flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/services/vendor/${vendor.slug}`} className="group block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={vendor.coverImage || "/icons/placeholder.jpg"}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Top badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    {vendor.isVerified && (
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-green-700 shadow-sm">
                        Verified
                      </span>
                    )}
                    <span className="ml-auto px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium mb-2">
                      {vendor.category.name}
                    </span>
                    <h3 className="text-lg font-semibold text-white leading-tight">
                      {vendor.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-neutral-500">
                    <MapPin className="w-4 h-4" />
                    {vendor.location.name}
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {priceLabels[vendor.priceRange]}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="md:hidden text-center mt-8">
          <Link 
            href="/services/all"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-neutral-200 rounded-full font-medium hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Destinations Section - Bento style
function DestinationsSection() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      const data = await getLocations();
      setLocations(data);
      setLoading(false);
    }
    fetchLocations();
  }, []);

  if (loading || locations.length === 0) return null;

  // Take first 5 locations for bento layout
  const displayLocations = locations.slice(0, 5);

  return (
    <section className="py-20 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-orange-400 tracking-wider uppercase">
            Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Popular Destinations
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:grid-rows-2">
          {displayLocations.map((location, index) => {
            // First item spans 2 columns and 2 rows on desktop
            const isLarge = index === 0;
            
            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={isLarge ? "md:col-span-2 md:row-span-2" : ""}
              >
                <Link
                  href={`/services/${location.slug}`}
                  className={`group block relative overflow-hidden rounded-2xl ${
                    isLarge ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={location.image || "/icons/placeholder.jpg"}
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div>
                      <h3 className={`font-bold text-white ${isLarge ? "text-3xl md:text-4xl" : "text-xl"}`}>
                        {location.name}
                      </h3>
                      <p className="text-white/70 text-sm mt-1">
                        {location.vendorCount} services available
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                        Explore
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {locations.length > 5 && (
          <div className="text-center mt-10">
            <Link 
              href="/services/locations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors"
            >
              View All Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// How It Works - Minimal
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Pick a destination",
      description: "Choose from our list of popular travel spots across India.",
    },
    {
      number: "02",
      title: "Browse services",
      description: "Explore verified vendors for transport, stays, activities & more.",
    },
    {
      number: "03",
      title: "Connect directly",
      description: "Contact vendors via WhatsApp or phone. No booking fees.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-orange-600 tracking-wider uppercase">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-2">
            How it works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-600 text-2xl font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {step.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to explore?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Start discovering amazing local services at your favorite destinations.
            </p>
            <button
              onClick={() => setLocationModalOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 rounded-full font-semibold hover:bg-neutral-100 transition-colors shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              Choose Your Destination
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      <LocationSelectorModal 
        open={locationModalOpen} 
        onOpenChange={setLocationModalOpen} 
      />
    </>
  );
}

// Loading state
function HeroSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="animate-pulse text-neutral-400">Loading...</div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      
      <ServicesSection />
      
      <FeaturedSection />
      
      <DestinationsSection />
      
      <HowItWorksSection />
      
      <CTASection />
      
      <Footer />
    </main>
  );
}
