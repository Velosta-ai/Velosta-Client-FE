"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  vendorName: string;
}

export function VendorMap({ latitude, longitude, address, vendorName }: VendorMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${latitude}%C2%B0${longitude}'!5e0!3m2!1sen!2sin!4v1234567890`;
  
  const simpleEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border/50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Location</h2>
                {address && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{address}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="hidden sm:flex"
              >
                <Maximize2 className="w-4 h-4 mr-1" />
                Expand
              </Button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="relative aspect-video sm:aspect-[2/1]">
          <iframe
            src={simpleEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/30">
          <div className="flex flex-wrap gap-3">
            {/* <Button
              variant="default"
              size="sm"
              asChild
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90"
            >
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </a>
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={openInMapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
                <div>
                  <h2 className="font-semibold text-foreground">{vendorName}</h2>
                  {address && (
                    <p className="text-sm text-muted-foreground">{address}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90"
                >
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Fullscreen Map */}
            <div className="flex-1 relative">
              <iframe
                src={simpleEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
