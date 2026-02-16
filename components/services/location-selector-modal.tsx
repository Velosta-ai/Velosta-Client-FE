"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, X, Clock, Check } from "lucide-react";
import { getLocations, type Location } from "@/lib/services-api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LocationSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

// Mock recent searches - in production, this would come from localStorage or API
const RECENT_SEARCHES = [
  { name: "Rishikesh", state: "Uttarakhand", time: "Searched 2 days ago" },
  { name: "Udaipur", state: "Rajasthan", time: "Searched last week" },
];

export function LocationSelectorModal({
  open,
  onOpenChange,
  selectedLocation,
  onSelectLocation,
}: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

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
    onSelectLocation(location);
    onOpenChange(false);
  };

  const handleRecentSearch = (name: string) => {
    const location = locations.find(
      (loc) => loc.name.toLowerCase() === name.toLowerCase()
    );
    if (location) {
      handleSelectLocation(location);
    }
  };

  const isSelected = (location: Location) => 
    selectedLocation?.id === location.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden p-0 border-0 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Where are you traveling?
          </h2>
        </div>

        {/* Search Input */}
        <div className="px-6 pb-6">
          <div
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isFocused
                ? "border-orange-500 bg-orange-50/30"
                : "border-neutral-200 bg-white"
            }`}
          >
            <MapPin
              className={`w-5 h-5 transition-colors ${
                isFocused ? "text-orange-500" : "text-neutral-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search for city, town, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition-colors"
              >
                <X className="w-3 h-3 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[50vh]">
          {/* Search Results */}
          {searchQuery ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                  Search Results
                </p>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-neutral-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredLocations.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleSelectLocation(location)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                          isSelected(location)
                            ? "bg-orange-50 border-2 border-orange-500"
                            : "hover:bg-neutral-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                          <Image
                            src={location.image || "/icons/placeholder.jpg"}
                            alt={location.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {location.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {location.state}
                          </p>
                        </div>
                        {isSelected(location) && (
                          <Check className="w-5 h-5 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                    <p className="text-neutral-500">No locations found</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {/* Popular Destinations */}
              <div className="mb-8">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                  Popular Destinations
                </p>
                {loading ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 animate-pulse" />
                        <div className="w-12 h-3 bg-neutral-100 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
                    {locations.slice(0, 6).map((location, index) => (
                      <motion.button
                        key={location.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectLocation(location)}
                        className="flex flex-col items-center gap-2 flex-shrink-0 group"
                      >
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md group-hover:shadow-lg ${
                          isSelected(location)
                            ? "border-orange-500 ring-2 ring-orange-500/30"
                            : "border-transparent group-hover:border-orange-500"
                        }`}>
                          <Image
                            src={location.image || "/icons/placeholder.jpg"}
                            alt={location.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          isSelected(location)
                            ? "text-orange-600"
                            : "text-neutral-700 group-hover:text-orange-600"
                        }`}>
                          {location.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Searches */}
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                  Recent Searches
                </p>
                <div className="space-y-1">
                  {RECENT_SEARCHES.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {search.name}, {search.state}
                        </p>
                        <p className="text-sm text-neutral-400">{search.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
