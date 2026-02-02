"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Clock, MapPin, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "./lead-form-modal";
import { type Vendor, createLead } from "@/lib/services-api";

interface VendorContactSectionProps {
  vendor: Vendor;
}

export function VendorContactSection({ vendor }: VendorContactSectionProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleWhatsAppClick = async () => {
    // Track WhatsApp click as a lead
    await createLead({
      vendorId: vendor.id,
      name: "WhatsApp User",
      phone: "",
      type: "WHATSAPP_CLICK",
    });
    
    const message = encodeURIComponent(
      `Hi! I found your business on Velosta and I'm interested in your services.`
    );
    window.open(`https://wa.me/${vendor.whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border/50 p-6 sticky top-28"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Contact {vendor.name}
        </h3>

        <div className="space-y-3 mb-6">
          <Button
            onClick={handleWhatsAppClick}
            className="w-full h-12 rounded-xl text-base font-semibold bg-green-500 hover:bg-green-600"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </Button>

          <Button
            onClick={() => setShowLeadForm(true)}
            variant="outline"
            className="w-full h-12 rounded-xl text-base font-semibold border-[var(--color-brand)]/30 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
          >
            <Phone className="w-5 h-5 mr-2" />
            Request Callback
          </Button>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span>{vendor.phone}</span>
            </a>
          )}

          {vendor.email && (
            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="truncate">{vendor.email}</span>
            </a>
          )}

          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="truncate">Visit Website</span>
            </a>
          )}

          {vendor.address && (
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span>{vendor.address}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Usually responds within 1 hour</span>
          </div>
        </div>
      </motion.div>

      <LeadFormModal
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        vendor={vendor}
      />
    </>
  );
}
