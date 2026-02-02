"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategories, type ServiceCategory } from "@/lib/services-api";

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  minRating: number | null;
  verified: boolean;
}

interface ServiceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  showCategoryFilter?: boolean;
}

const priceRangeOptions = [
  { value: "BUDGET", label: "Budget Friendly" },
  { value: "MODERATE", label: "Moderate" },
  { value: "PREMIUM", label: "Premium" },
  { value: "LUXURY", label: "Luxury" },
];

const ratingOptions = [4.5, 4.0, 3.5, 3.0];

export function ServiceFilters({ 
  filters, 
  onFiltersChange,
  showCategoryFilter = true 
}: ServiceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    if (showCategoryFilter) {
      getCategories().then(setCategories);
    }
  }, [showCategoryFilter]);

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.priceRanges.length > 0 || 
    filters.minRating !== null || 
    filters.verified;

  const activeFilterCount = 
    filters.categories.length + 
    filters.priceRanges.length + 
    (filters.minRating ? 1 : 0) + 
    (filters.verified ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRanges: [],
      minRating: null,
      verified: false,
    });
  };

  const toggleCategory = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const togglePriceRange = (value: string) => {
    const newRanges = filters.priceRanges.includes(value)
      ? filters.priceRanges.filter((r) => r !== value)
      : [...filters.priceRanges, value];
    onFiltersChange({ ...filters, priceRanges: newRanges });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {showCategoryFilter && categories.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.categories.includes(category.slug)}
                  onCheckedChange={() => toggleCategory(category.slug)}
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-foreground mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRangeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.priceRanges.includes(option.value)}
                onCheckedChange={() => togglePriceRange(option.value)}
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              onClick={() => onFiltersChange({ 
                ...filters, 
                minRating: filters.minRating === rating ? null : rating 
              })}
              className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                filters.minRating === rating
                  ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                  : "hover:bg-muted"
              }`}
            >
              <Star className={`w-4 h-4 ${filters.minRating === rating ? "fill-current" : ""}`} />
              <span className="text-sm">{rating}+ stars</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={filters.verified}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, verified: checked === true })
            }
          />
          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
            Verified vendors only
          </span>
        </label>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[var(--color-brand)] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="rounded-full shadow-lg shadow-[var(--color-brand)]/25 px-6"
              style={{
                background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(80vh-100px)] pb-20">
              <FilterContent />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-full"
                style={{
                  background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
                }}
              >
                Show Results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
