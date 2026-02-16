"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getCategories, ServiceCategory, Location } from "@/lib/services-api";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  MapPin, ArrowRight, ShieldCheck, 
  MessageSquare, Search, Sparkles, Star, Check, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelectorModal } from "@/components/services/location-selector-modal";

// Flaticon icon IDs for each category
const CATEGORY_ICONS: Record<string, number> = {
  "cabs": 3097180,
  "taxi": 3097180,
  "bike": 14996363,
  "homestay": 2544087,
  "hotel": 2933921,
  "hostel": 648539,
  "activit": 8863868,
  "adventure": 8863868,
  "guide": 13561110,
  "restaurant": 4223218,
  "food": 4223218,
  "dining": 4223218,
  "spa": 5731912,
  "wellness": 5731912,
  "photo": 5848744,
  "water": 2264825,
  "trek": 5064158,
  "hik": 5064158,
  "camp": 5064158,
  "package": 13208908,
  "tour": 13208908,
  "boat": 2972461,
  "stay": 2933953,
  "resort": 2933953,
};

const DEFAULT_ICON_ID = 3135715;

// Helper to get icon URL from Flaticon CDN
function getCategoryIconUrl(slug: string): string {
  const normalizedSlug = slug.toLowerCase();
  
  // Find matching icon by checking if slug contains any key
  for (const [key, iconId] of Object.entries(CATEGORY_ICONS)) {
    if (normalizedSlug.includes(key)) {
      const folder = Math.floor(iconId / 1000);
      return `https://cdn-icons-png.flaticon.com/512/${folder}/${iconId}.png`;
    }
  }
  
  // Return default icon
  const folder = Math.floor(DEFAULT_ICON_ID / 1000);
  return `https://cdn-icons-png.flaticon.com/512/${folder}/${DEFAULT_ICON_ID}.png`;
}

// Hero Section with Search Bar
function HeroSection() {
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      const filtered = data.filter((cat) => !HIDDEN_CATEGORIES.includes(cat.slug));
      setCategories(filtered);
    }
    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!selectedLocation) {
      // If no location selected, open the location modal
      setLocationModalOpen(true);
      return;
    }
    
    // Build the URL with location and optional category
    let url = `/services/${selectedLocation.slug}`;
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }
    router.push(url);
  };

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden bg-white">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-30"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6">
              Discover trusted{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                local services
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
              Connect directly with verified vendors for hotels, rentals, adventures, and more. No hidden fees.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <div 
                ref={searchBarRef}
                className="bg-white rounded-full shadow-xl shadow-neutral-200/60 border border-neutral-100 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                {/* Location Input */}
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="flex-1 flex items-center gap-3 px-5 py-3 rounded-full hover:bg-neutral-50 transition-colors text-left"
                >
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Location</p>
                    <p className={`text-sm ${selectedLocation ? "text-neutral-900 font-medium" : "text-neutral-700"}`}>
                      {selectedLocation ? selectedLocation.name : "Where are you going?"}
                    </p>
                  </div>
                </button>

                <div className="hidden sm:block w-px h-10 bg-neutral-200" />

                {/* Service Type */}
                <button
                  onClick={() => setCategoryModalOpen(!categoryModalOpen)}
                  className={`flex-1 flex items-center gap-3 px-5 py-3 rounded-full hover:bg-neutral-50 transition-colors text-left ${categoryModalOpen ? "bg-neutral-50" : ""}`}
                >
                  {selectedCategory ? (
                    <Image
                      src={getCategoryIconUrl(selectedCategory)}
                      alt=""
                      width={20}
                      height={20}
                      className="shrink-0 object-contain"
                      unoptimized
                    />
                  ) : (
                    <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 font-medium">Service</p>
                    <p className={`text-sm ${selectedCategory ? "text-neutral-900 font-medium" : "text-neutral-700"}`}>
                      {selectedCategory 
                        ? categories.find(c => c.slug === selectedCategory)?.name 
                        : "All services"}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${categoryModalOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25"
                >
                  <Search className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>

              {/* Category Dropdown */}
              <CategoryDropdown
                isOpen={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                anchorRef={searchBarRef}
              />
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10"
            >
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>100% Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>4.8 Average Rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span>Direct Chat Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <LocationSelectorModal 
        open={locationModalOpen} 
        onOpenChange={setLocationModalOpen}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
    </>
  );
}

// Category Dropdown Component
function CategoryDropdown({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  anchorRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - fixed to cover entire screen */}
      <div 
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      
      {/* Dropdown - Fixed position */}
      <div 
        className="fixed w-72 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden -translate-x-1/2"
        style={{ 
          zIndex: 9999, 
          top: position.top,
          left: position.left,
        }}
      >
        {/* Scrollable list */}
        <div className="max-h-72 overflow-y-auto">
          {/* All Services Option */}
          <button
            onClick={() => {
              onSelectCategory(null);
              onClose();
            }}
            className={`w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors ${
              selectedCategory === null ? "bg-orange-50/50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
              <span className={`text-sm ${selectedCategory === null ? "text-neutral-900 font-medium" : "text-neutral-700"}`}>
                All Services
              </span>
            </div>
            {selectedCategory === null && (
              <Check className="w-5 h-5 text-orange-500" />
            )}
          </button>
          
          {/* Divider */}
          <div className="h-px bg-neutral-100 mx-4" />
          
          {/* Category List */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.slug);
                onClose();
              }}
              className={`w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors ${
                selectedCategory === category.slug ? "bg-orange-50/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={getCategoryIconUrl(category.slug)}
                    alt={category.name}
                    width={22}
                    height={22}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className={`text-sm ${selectedCategory === category.slug ? "text-neutral-900 font-medium" : "text-neutral-700"}`}>
                  {category.name}
                </span>
              </div>
              {selectedCategory === category.slug && (
                <Check className="w-5 h-5 text-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Categories to hide from the grid
const HIDDEN_CATEGORIES = [
  "equipment-rentals", 
  "equipment-rental",
  "local-transport", 
  "transport",
  "rentals",
];

// Browse by Category Section with Illustrated Icons
function CategoriesSection() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      // Filter out hidden categories
      const filteredCategories = data.filter(
        (cat) => !HIDDEN_CATEGORIES.includes(cat.slug)
      );
      setCategories(filteredCategories);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-neutral-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Browse by category
            </h2>
          </div>
          <Link 
            href="/services/categories"
            className="hidden md:flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => {
            const iconUrl = getCategoryIconUrl(category.slug);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/services?category=${category.slug}`}
                  className="group block"
                >
                  <div className="relative bg-white border border-neutral-200 rounded-2xl p-5 h-40 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-1">
                    {/* Flaticon Premium Icon */}
                    <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={iconUrl}
                        alt={category.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    
                    {/* Name */}
                    <div className="text-center">
                      <h3 className="font-semibold text-neutral-800 text-sm group-hover:text-orange-600 transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {category.vendorCount}+ listings
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Show more categories */}
        {categories.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(6, 12).map((category, index) => {
                const iconUrl = getCategoryIconUrl(category.slug);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/services?category=${category.slug}`}
                      className="group block"
                    >
                      <div className="relative bg-white border border-neutral-200 rounded-2xl p-5 h-40 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-1">
                        <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                          <Image
                            src={iconUrl}
                            alt={category.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-neutral-800 text-sm group-hover:text-orange-600 transition-colors leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1">
                            {category.vendorCount}+ listings
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Mobile view all */}
        <div className="md:hidden text-center mt-8">
          <Link 
            href="/services/categories"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Velosta AI CTA Section - Minimal & Impactful
function VelostaAICTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/velosta-ai"
            className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-12 hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left - Content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">AI-Powered</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Not sure where to go?
                </h2>
                <p className="text-neutral-400 text-lg">
                  Tell us your budget. We&apos;ll find your perfect trip.
                </p>
              </div>
              
              {/* Right - CTA */}
              <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-semibold shadow-lg shadow-orange-500/25 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-5 h-5" />
                <span>Plan with AI</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Why Velosta Banner Section
function WhyVelostaSection() {
  const highlights = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Verified Vendors" },
    { icon: <MessageSquare className="w-5 h-5" />, text: "Direct WhatsApp Chat" },
    { icon: <Star className="w-5 h-5" />, text: "Zero Platform Fees" },
    { icon: <MapPin className="w-5 h-5" />, text: "Local Expertise" },
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Banner background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900" />
      
      {/* Decorative gradient accents */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-orange-500/20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-500/20 to-transparent" />
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Left - Headline */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Why travelers love{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Velosta
              </span>
            </h2>
          </div>

          {/* Right - Highlights */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 md:gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <span className="text-orange-400">{item.icon}</span>
                <span className="text-white text-sm font-medium whitespace-nowrap">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-8 md:gap-12 mt-8 pt-6 border-t border-white/10"
        >
          {[
            { value: "200+", label: "Vendors" },
            { value: "15+", label: "Destinations" },
            { value: "10K+", label: "Travelers" },
            { value: "4.8★", label: "Rating" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="text-center"
            >
              <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Loading skeleton
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-neutral-400">Loading...</div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <Suspense fallback={<PageSkeleton />}>
        <HeroSection />
      </Suspense>
      
      <CategoriesSection />
      
      <VelostaAICTASection />
      
      <WhyVelostaSection />
      
      <Footer />
    </main>
  );
}
