"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Search, ChevronRight } from "lucide-react";
import { getLocations, type Location } from "@/lib/services-api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface LocationSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationSelectorModal({
  open,
  onOpenChange,
}: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      async function fetchLocations() {
        setLoading(true);
        const data = await getLocations();
        setLocations(data);
        setLoading(false);
      }
      fetchLocations();
    }
  }, [open]);

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (location: Location) => {
    onOpenChange(false);
    router.push(`/services/${location.slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 border-0 rounded-3xl bg-white">
        <div className="p-6 pb-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Select Your Location
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose where you want to explore services
            </p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for a city or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border border-gray-200 text-base bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-brand)]/20"
            />
          </div>

          <button className="flex items-center gap-2 mb-6 font-medium transition-colors hover:opacity-80 w-full p-3 rounded-xl bg-gradient-to-r from-[var(--color-brand-start)]/10 to-[var(--color-brand)]/10 border border-[var(--color-brand)]/20">
            <MapPin
              className="w-5 h-5"
              style={{ color: "var(--color-brand)" }}
            />
            <span style={{ color: "var(--color-brand)" }}>
              Detect my location
            </span>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[50vh]">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Popular Destinations
          </h3>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {filteredLocations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectLocation(location)}
                    className="group relative overflow-hidden rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
                  >
                    <div className="relative h-24 w-full overflow-hidden">
                      <Image
                        src={location.image || "/icons/placeholder.jpg"}
                        alt={location.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="font-semibold text-white text-sm">
                        {location.name}
                      </h4>
                      <p className="text-xs text-white/80">{location.state}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-white/70">
                          {location.vendorCount} services
                        </span>
                        <ChevronRight className="w-4 h-4 text-white/70 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No locations found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for a different city
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
