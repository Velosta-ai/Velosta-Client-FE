"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategories, type ServiceCategory } from "@/lib/services-api";
import { cn } from "@/lib/utils";

// Custom illustrated SVG icons for each category
const CategoryIcons: Record<string, React.ReactNode> = {
  "cabs-taxi": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="8" y="20" width="32" height="16" rx="4" fill="#FCD34D"/>
      <rect x="10" y="24" width="8" height="6" rx="1" fill="#1E293B"/>
      <rect x="30" y="24" width="8" height="6" rx="1" fill="#1E293B"/>
      <rect x="18" y="14" width="12" height="8" rx="2" fill="#FCD34D"/>
      <circle cx="14" cy="38" r="4" fill="#374151"/>
      <circle cx="14" cy="38" r="2" fill="#9CA3AF"/>
      <circle cx="34" cy="38" r="4" fill="#374151"/>
      <circle cx="34" cy="38" r="2" fill="#9CA3AF"/>
      <rect x="20" y="16" width="8" height="4" rx="1" fill="#F97316"/>
    </svg>
  ),
  "bike-rentals": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <circle cx="12" cy="32" r="8" stroke="#F97316" strokeWidth="3" fill="none"/>
      <circle cx="36" cy="32" r="8" stroke="#F97316" strokeWidth="3" fill="none"/>
      <path d="M12 32L20 20L28 32" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 32L36 32" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 20L28 20" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="3" fill="#1E293B"/>
      <path d="M28 20L32 14" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  "homestays": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M6 24L24 8L42 24" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="24" width="28" height="18" fill="#FEF3C7"/>
      <rect x="10" y="24" width="28" height="18" stroke="#1E293B" strokeWidth="2"/>
      <rect x="20" y="30" width="8" height="12" fill="#F97316"/>
      <rect x="13" y="28" width="5" height="5" fill="#BFDBFE" stroke="#1E293B" strokeWidth="1"/>
      <rect x="30" y="28" width="5" height="5" fill="#BFDBFE" stroke="#1E293B" strokeWidth="1"/>
      <circle cx="38" cy="12" r="4" fill="#FCD34D"/>
    </svg>
  ),
  "hotels": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="8" y="12" width="32" height="30" fill="#E5E7EB" stroke="#1E293B" strokeWidth="2"/>
      <rect x="12" y="16" width="6" height="6" fill="#BFDBFE"/>
      <rect x="21" y="16" width="6" height="6" fill="#BFDBFE"/>
      <rect x="30" y="16" width="6" height="6" fill="#BFDBFE"/>
      <rect x="12" y="26" width="6" height="6" fill="#FCD34D"/>
      <rect x="21" y="26" width="6" height="6" fill="#BFDBFE"/>
      <rect x="30" y="26" width="6" height="6" fill="#BFDBFE"/>
      <rect x="20" y="36" width="8" height="6" fill="#F97316"/>
      <rect x="6" y="8" width="36" height="4" fill="#F97316"/>
    </svg>
  ),
  "hostels": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="6" y="14" width="36" height="28" rx="2" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2"/>
      <rect x="10" y="20" width="12" height="8" rx="1" fill="#F97316"/>
      <rect x="26" y="20" width="12" height="8" rx="1" fill="#F97316"/>
      <rect x="10" y="32" width="12" height="8" rx="1" fill="#BFDBFE"/>
      <rect x="26" y="32" width="12" height="8" rx="1" fill="#BFDBFE"/>
      <path d="M24 8L24 14" stroke="#1E293B" strokeWidth="2"/>
      <circle cx="24" cy="6" r="3" fill="#F97316"/>
    </svg>
  ),
  "activities": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <circle cx="24" cy="10" r="6" fill="#FCD34D"/>
      <path d="M24 16V28" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 28L16 42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 28L32 42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
      <path d="M16 20L8 28" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <path d="M32 20L40 28" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  "local-guides": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <circle cx="24" cy="14" r="8" fill="#FCD34D"/>
      <ellipse cx="24" cy="38" rx="14" ry="6" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2"/>
      <path d="M16 26C16 26 18 32 24 32C30 32 32 26 32 26" stroke="#1E293B" strokeWidth="2"/>
      <rect x="32" y="8" width="10" height="14" rx="1" fill="#F97316"/>
      <path d="M34 12H40M34 16H38" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "restaurants": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <ellipse cx="24" cy="36" rx="16" ry="4" fill="#E5E7EB"/>
      <ellipse cx="24" cy="28" rx="14" ry="10" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2"/>
      <circle cx="18" cy="26" r="3" fill="#F97316"/>
      <circle cx="28" cy="24" r="4" fill="#22C55E"/>
      <circle cx="22" cy="30" r="2" fill="#EF4444"/>
      <path d="M8 8V20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 8C8 8 12 10 12 14C12 18 8 20 8 20" stroke="#9CA3AF" strokeWidth="2"/>
      <path d="M40 8V12M40 12V20M40 12H36V8M40 12H44V8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  "spa-wellness": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <ellipse cx="24" cy="38" rx="12" ry="4" fill="#DCFCE7"/>
      <path d="M24 38C24 38 12 32 12 20C12 12 18 8 24 8C30 8 36 12 36 20C36 32 24 38 24 38Z" fill="#22C55E"/>
      <path d="M24 8V38" stroke="#166534" strokeWidth="2"/>
      <path d="M18 16C18 16 20 20 24 20" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 22C30 22 28 26 24 26" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="36" cy="12" r="4" fill="#F97316" opacity="0.6"/>
      <circle cx="40" cy="20" r="3" fill="#F97316" opacity="0.4"/>
    </svg>
  ),
  "photography": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="6" y="14" width="36" height="26" rx="4" fill="#1E293B"/>
      <circle cx="24" cy="27" r="10" fill="#374151"/>
      <circle cx="24" cy="27" r="7" fill="#60A5FA"/>
      <circle cx="24" cy="27" r="3" fill="#1E293B"/>
      <rect x="18" y="10" width="12" height="4" rx="1" fill="#374151"/>
      <circle cx="36" cy="20" r="2" fill="#F97316"/>
      <path d="M10 20H14" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  "water-sports": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M4 32C8 28 12 32 16 28C20 24 24 32 28 28C32 24 36 32 40 28C44 24 48 32 48 32" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round"/>
      <path d="M4 40C8 36 12 40 16 36C20 32 24 40 28 36C32 32 36 40 40 36C44 32 48 40 48 40" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 8L20 24H28L24 8Z" fill="#F97316"/>
      <circle cx="24" cy="18" r="6" fill="#FCD34D"/>
    </svg>
  ),
  "trekking": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M4 40L16 20L28 32L44 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="44" cy="12" r="4" fill="#F97316"/>
      <path d="M20 28L24 40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 28L16 40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="22" r="4" fill="#FCD34D"/>
      <path d="M36 20V8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M36 8L40 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  "camping": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M6 40L24 12L42 40H6Z" fill="#F97316"/>
      <path d="M24 12L12 40H36L24 12Z" fill="#FEF3C7"/>
      <rect x="21" y="28" width="6" height="12" fill="#1E293B"/>
      <circle cx="38" cy="10" r="4" fill="#FCD34D"/>
      <path d="M8 10L10 16L14 10L10 4L8 10Z" fill="#22C55E"/>
      <path d="M40 22L42 28L46 22L42 16L40 22Z" fill="#22C55E"/>
    </svg>
  ),
  "travel-packages": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="10" y="16" width="28" height="24" rx="3" fill="#F97316"/>
      <rect x="14" y="20" width="20" height="16" rx="2" fill="#FEF3C7"/>
      <rect x="18" y="8" width="12" height="10" rx="2" fill="#1E293B"/>
      <path d="M22 8V4M26 8V4" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      <rect x="17" y="24" width="6" height="4" fill="#60A5FA"/>
      <rect x="25" y="24" width="6" height="4" fill="#22C55E"/>
      <rect x="17" y="30" width="6" height="4" fill="#FCD34D"/>
      <rect x="25" y="30" width="6" height="4" fill="#F472B6"/>
    </svg>
  ),
  "transport": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="4" y="18" width="40" height="18" rx="4" fill="#60A5FA"/>
      <rect x="8" y="22" width="10" height="8" rx="1" fill="#BFDBFE"/>
      <rect x="20" y="22" width="10" height="8" rx="1" fill="#BFDBFE"/>
      <rect x="32" y="22" width="8" height="8" rx="1" fill="#1E293B"/>
      <circle cx="12" cy="38" r="4" fill="#1E293B"/>
      <circle cx="36" cy="38" r="4" fill="#1E293B"/>
      <rect x="4" y="14" width="40" height="4" fill="#F97316"/>
    </svg>
  ),
  "boat-rides": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M8 32L14 20H34L40 32H8Z" fill="#F97316"/>
      <rect x="22" y="8" width="4" height="14" fill="#1E293B"/>
      <path d="M26 10L38 20H26V10Z" fill="#FEF3C7"/>
      <path d="M4 36C8 32 12 36 16 32C20 28 24 36 28 32C32 28 36 36 40 32C44 28 48 36 48 36" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="26" r="2" fill="#1E293B"/>
      <circle cx="30" cy="26" r="2" fill="#1E293B"/>
    </svg>
  ),
  "stays-resorts": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="6" y="20" width="36" height="22" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2"/>
      <path d="M4 20L24 6L44 20" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="20" y="30" width="8" height="12" fill="#F97316"/>
      <rect x="10" y="26" width="6" height="6" fill="#BFDBFE" stroke="#1E293B"/>
      <rect x="32" y="26" width="6" height="6" fill="#BFDBFE" stroke="#1E293B"/>
      <ellipse cx="36" cy="14" rx="6" ry="4" fill="#22C55E"/>
      <rect x="35" y="14" width="2" height="6" fill="#8B5CF6"/>
    </svg>
  ),
  "hostels-backpackers": (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="14" y="8" width="20" height="28" rx="4" fill="#F97316"/>
      <rect x="18" y="12" width="12" height="8" rx="1" fill="#FEF3C7"/>
      <rect x="18" y="24" width="12" height="8" rx="1" fill="#FEF3C7"/>
      <path d="M20 36V44M28 36V44" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 36H32" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="4" r="3" fill="#FCD34D"/>
    </svg>
  ),
};

// Default icon for categories without specific icons
const DefaultIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <circle cx="24" cy="24" r="16" fill="#F3F4F6" stroke="#F97316" strokeWidth="2"/>
    <circle cx="24" cy="24" r="8" fill="#F97316"/>
    <circle cx="24" cy="24" r="4" fill="white"/>
  </svg>
);

interface ServiceCategoryGridProps {
  locationSlug?: string;
  onCategoryClick?: (category: ServiceCategory) => void;
}

export function ServiceCategoryGrid({ locationSlug, onCategoryClick }: ServiceCategoryGridProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_SHOW = 8;

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No categories available yet.
      </div>
    );
  }

  const visibleCategories = showAll ? categories : categories.slice(0, INITIAL_SHOW);
  const hasMore = categories.length > INITIAL_SHOW;

  return (
    <div className="space-y-8">
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {visibleCategories.map((category, index) => {
            const icon = CategoryIcons[category.slug] || DefaultIcon;
            const href = locationSlug 
              ? `/services/${locationSlug}?category=${category.slug}`
              : `/services?category=${category.slug}`;

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
              >
                <Link
                  href={href}
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault();
                      onCategoryClick(category);
                    }
                  }}
                  className="group block"
                >
                  <div className="relative bg-white border border-neutral-200 rounded-2xl p-5 h-32 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-1">
                    {/* Icon */}
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </div>
                    
                    {/* Name */}
                    <span className="text-sm font-medium text-neutral-700 text-center leading-tight group-hover:text-neutral-900">
                      {category.name}
                    </span>

                    {/* Vendor count badge */}
                    {category.vendorCount > 0 && (
                      <span className="absolute top-3 right-3 text-xs text-neutral-400 font-medium">
                        {category.vendorCount}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-700 font-medium transition-all duration-300"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                View All {categories.length} Services <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Compact pill-style category selector for location pages
interface ServiceCategoryScrollProps {
  locationSlug?: string;
  activeCategory?: string;
  onCategoryChange?: (slug: string | null) => void;
  categories?: ServiceCategory[];
}

export function ServiceCategoryScroll({ 
  locationSlug, 
  activeCategory, 
  onCategoryChange,
  categories: propCategories,
}: ServiceCategoryScrollProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>(propCategories || []);
  const [loading, setLoading] = useState(!propCategories);

  useEffect(() => {
    if (!propCategories) {
      async function fetchCategories() {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
      }
      fetchCategories();
    }
  }, [propCategories]);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-full bg-neutral-100 animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange?.(null)}
        className={cn(
          "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
          !activeCategory
            ? "bg-neutral-900 text-white border-neutral-900"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
        )}
      >
        All Services
      </button>
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(isActive ? null : category.slug)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
              isActive
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
