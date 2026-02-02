"use client";

import { useState } from "react";
import { MapPin, Search, Star, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelectorModal } from "./location-selector-modal";
import { motion } from "framer-motion";

export function ServicesHero() {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-b from-neutral-50 to-white pt-28 pb-20 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-sm font-medium mb-6"
            >
              <ShieldCheck className="w-4 h-4" />
              Trusted Local Services
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-5 tracking-tight">
              Book Local Services
              <br />
              <span className="text-[var(--color-brand)]">With Confidence</span>
            </h1>

            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10">
              Discover verified vendors for taxis, homestays, activities and more. 
              Connect directly and enjoy hassle-free travel.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={() => setLocationModalOpen(true)}
                size="lg"
                className="h-14 px-8 rounded-full text-base font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90 text-white shadow-lg shadow-[var(--color-brand)]/25 hover:shadow-xl hover:shadow-[var(--color-brand)]/30 transition-all duration-300"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Select Your Destination
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full text-base font-semibold border-neutral-300 hover:bg-neutral-100"
                asChild
              >
                <a href="#categories">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Services
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-14"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-neutral-900">200+</p>
                  <p className="text-sm text-neutral-500">Verified Vendors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-neutral-900">4.8</p>
                  <p className="text-sm text-neutral-500">Average Rating</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-neutral-900">10K+</p>
                  <p className="text-sm text-neutral-500">Happy Travelers</p>
                </div>
              </div>
            </motion.div>
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
