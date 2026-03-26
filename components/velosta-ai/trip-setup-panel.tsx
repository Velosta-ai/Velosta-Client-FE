"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  User,
  Users2,
  Heart,
  Zap,
  Wind,
  Sparkles,
  Mountain,
  Utensils,
  Camera,
  Palette,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripFormData {
  destination: string;
  dateRange: { start: string; end: string };
  budget: string;
  travelType: string;
  travelVibe: string[];
  travelers: { adults: number; children: number };
  mustVisitPlaces: string[];
}

interface TripSetupPanelProps {
  onGenerate: (data: TripFormData) => void;
  isGenerating: boolean;
}

const travelTypes = [
  { id: "solo", label: "Solo", icon: User },
  { id: "friends", label: "Friends", icon: Users2 },
  { id: "family", label: "Family", icon: Users },
  { id: "couple", label: "Couple", icon: Heart },
];

const vibes = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "chill", label: "Relaxation", icon: Wind },
  { id: "culture", label: "Culture", icon: Palette },
  { id: "food", label: "Food", icon: Utensils },
  { id: "party", label: "Nightlife", icon: Zap },
  { id: "spiritual", label: "Spiritual", icon: Sparkles },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "nature", label: "Nature", icon: Mountain },
];

export default function TripSetupPanel({
  onGenerate,
  isGenerating,
}: TripSetupPanelProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    dateRange: { start: "", end: "" },
    budget: "",
    travelType: "",
    travelVibe: [],
    travelers: { adults: 1, children: 0 },
    mustVisitPlaces: [],
  });

  const [mustVisitInput, setMustVisitInput] = useState("");

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVibe = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      travelVibe: prev.travelVibe.includes(id)
        ? prev.travelVibe.filter((v) => v !== id)
        : [...prev.travelVibe, id],
    }));
  };

  const addMustVisit = () => {
    if (mustVisitInput.trim() && formData.mustVisitPlaces.length < 5) {
      setFormData((prev) => ({
        ...prev,
        mustVisitPlaces: [...prev.mustVisitPlaces, mustVisitInput.trim()],
      }));
      setMustVisitInput("");
    }
  };

  const removeMustVisit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mustVisitPlaces: prev.mustVisitPlaces.filter((_, i) => i !== index),
    }));
  };

  const canGenerate =
    formData.destination.trim() &&
    formData.dateRange.start &&
    formData.dateRange.end;

  const handleSubmit = () => {
    if (canGenerate && !isGenerating) {
      onGenerate(formData);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[color:var(--color-brand)]/10 flex items-center justify-center">
            <Plane className="w-4 h-4 text-[color:var(--color-brand)]" />
          </div>
          <h2 className="text-base font-semibold text-[color:var(--color-navy)]">
            Plan Your Trip
          </h2>
        </div>
        <p className="text-xs text-neutral-500 mt-1.5 pl-[42px]">
          Tell us about your ideal journey
        </p>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-5">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Where to?
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="e.g., Manali, Goa, Jaipur..."
              value={formData.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            When?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="date"
                value={formData.dateRange.start}
                onChange={(e) =>
                  updateField("dateRange", {
                    ...formData.dateRange,
                    start: e.target.value,
                  })
                }
                className="w-full pl-9 pr-2 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="date"
                value={formData.dateRange.end}
                onChange={(e) =>
                  updateField("dateRange", {
                    ...formData.dateRange,
                    end: e.target.value,
                  })
                }
                className="w-full pl-9 pr-2 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Budget
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="e.g., ₹15,000 or $500"
              value={formData.budget}
              onChange={(e) => updateField("budget", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Travel Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Who&apos;s Traveling?
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {travelTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => updateField("travelType", id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs transition-all",
                  formData.travelType === id
                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)]/5 text-[color:var(--color-brand)]"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travelers Count */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Travelers
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center justify-between bg-neutral-50/80 rounded-xl border border-neutral-200 px-3 py-2">
              <span className="text-xs text-neutral-600">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateField("travelers", {
                      ...formData.travelers,
                      adults: Math.max(1, formData.travelers.adults - 1),
                    })
                  }
                  className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-4 text-center text-[color:var(--color-navy)]">
                  {formData.travelers.adults}
                </span>
                <button
                  onClick={() =>
                    updateField("travelers", {
                      ...formData.travelers,
                      adults: formData.travelers.adults + 1,
                    })
                  }
                  className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between bg-neutral-50/80 rounded-xl border border-neutral-200 px-3 py-2">
              <span className="text-xs text-neutral-600">Children</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateField("travelers", {
                      ...formData.travelers,
                      children: Math.max(0, formData.travelers.children - 1),
                    })
                  }
                  className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-4 text-center text-[color:var(--color-navy)]">
                  {formData.travelers.children}
                </span>
                <button
                  onClick={() =>
                    updateField("travelers", {
                      ...formData.travelers,
                      children: formData.travelers.children + 1,
                    })
                  }
                  className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Vibe */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Trip Style
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {vibes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleVibe(id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[10px] transition-all",
                  formData.travelVibe.includes(id)
                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)]/5 text-[color:var(--color-brand)]"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Must Visit */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            Must-visit places{" "}
            <span className="text-neutral-400 normal-case">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a place..."
              value={mustVisitInput}
              onChange={(e) => setMustVisitInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMustVisit()}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all placeholder:text-neutral-400"
            />
            <button
              onClick={addMustVisit}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.mustVisitPlaces.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {formData.mustVisitPlaces.map((place, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[color:var(--color-brand)]/8 text-[color:var(--color-brand)] text-xs font-medium"
                >
                  {place}
                  <button
                    onClick={() => removeMustVisit(i)}
                    className="ml-0.5 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="px-5 py-4 border-t border-neutral-100">
        <button
          onClick={handleSubmit}
          disabled={!canGenerate || isGenerating}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
            canGenerate && !isGenerating
              ? "text-white shadow-lg shadow-[color:var(--color-brand)]/25 hover:shadow-xl hover:shadow-[color:var(--color-brand)]/35 active:scale-[0.98]"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          )}
          style={
            canGenerate && !isGenerating
              ? {
                  background:
                    "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
                }
              : undefined
          }
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Planning your trip...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Trip Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
}

