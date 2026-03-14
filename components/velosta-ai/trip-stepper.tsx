"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  User,
  Users2,
  Heart,
  Mountain,
  Waves,
  Building2,
  TreePine,
  Utensils,
  Backpack,
  Sparkles,
  ChevronLeft,
  Sun,
  Camera,
  Zap,
  Palette,
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── types ──────────────────────────────────────────────────── */
export interface TripFormData {
  destination: string;
  dateRange: { start: string; end: string };
  budget: string;
  budgetFlexibility: "strict" | "flexible";
  travelType: string;
  travelVibe: string[];
  travelers: { adults: number; children: number };
  mustVisitPlaces: string[];
  destinationKnown: boolean;
  travelFrom: string;
  tripPreferences: string[];
}

interface Props {
  onGenerate: (data: TripFormData) => void;
  isGenerating: boolean;
}

/* ─── data ───────────────────────────────────────────────────── */
const TRAVEL_TYPES = [
  { id: "solo", label: "Solo", sub: "Just me", icon: User },
  { id: "friends", label: "Friends", sub: "With buddies", icon: Users2 },
  { id: "couple", label: "Couple", sub: "Romantic trip", icon: Heart },
  { id: "family", label: "Family", sub: "With family", icon: Users },
];

const TRIP_PREFERENCES = [
  { id: "mountains", label: "Mountains", icon: Mountain },
  { id: "beaches", label: "Beaches", icon: Waves },
  { id: "cities", label: "Cities", icon: Building2 },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "food", label: "Food", icon: Utensils },
  { id: "backpacking", label: "Backpacking", icon: Backpack },
];

const VIBES = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "culture", label: "Culture", icon: Palette },
  { id: "food", label: "Food", icon: Utensils },
  { id: "nightlife", label: "Nightlife", icon: Zap },
  { id: "hidden-gems", label: "Hidden Gems", icon: Search },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "relaxation", label: "Relaxation", icon: Sun },
];

const BUDGET_MARKS = [5000, 10000, 15000, 20000, 30000, 50000];

/* ─── animation variants ─────────────────────────────────────── */
const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

/* ─── component ──────────────────────────────────────────────── */
export default function TripStepper({ onGenerate, isGenerating }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState<TripFormData>({
    destination: "",
    dateRange: { start: "", end: "" },
    budget: "15000",
    budgetFlexibility: "flexible",
    travelType: "",
    travelVibe: [],
    travelers: { adults: 1, children: 0 },
    mustVisitPlaces: [],
    destinationKnown: true,
    travelFrom: "",
    tripPreferences: [],
  });

  /* helpers */
  const set = useCallback(
    <K extends keyof TripFormData>(key: K, val: TripFormData[K]) =>
      setForm((p) => ({ ...p, [key]: val })),
    []
  );

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleArr = (key: "travelVibe" | "tripPreferences", id: string) => {
    setForm((p) => {
      const arr = p[key] as string[];
      return {
        ...p,
        [key]: arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id],
      };
    });
  };

  const adjustCount = (
    who: "adults" | "children",
    delta: number
  ) => {
    setForm((p) => ({
      ...p,
      travelers: {
        ...p.travelers,
        [who]: Math.max(who === "adults" ? 1 : 0, p.travelers[who] + delta),
      },
    }));
  };

  /* total steps: 0‑destination choice  1‑destination  2‑dates  3‑travelers  4‑budget  5‑style  6‑confirm */
  const TOTAL = 7;
  const pct = ((step + 1) / TOTAL) * 100;

  /* step‑specific "can continue" */
  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return true; // just clicking a button
      case 1:
        return form.destinationKnown
          ? form.destination.trim().length > 0
          : form.tripPreferences.length > 0;
      case 2:
        return !!form.dateRange.start && !!form.dateRange.end;
      case 3:
        return !!form.travelType;
      case 4:
        return Number(form.budget) > 0;
      case 5:
        return form.travelVibe.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleGenerate = () => {
    if (!isGenerating) onGenerate(form);
  };

  /* compute trip duration label */
  const tripDays = (() => {
    if (!form.dateRange.start || !form.dateRange.end) return null;
    const d =
      (new Date(form.dateRange.end).getTime() -
        new Date(form.dateRange.start).getTime()) /
      86400000;
    return d > 0 ? d : null;
  })();

  /* ────────────── RENDER ────────────── */
  return (
    <div className="h-full flex flex-col bg-white">
      {/* progress bar */}
      <div className="h-1 bg-neutral-100">
        <motion.div
          className="h-full bg-gradient-to-r from-[#DA880F]/80 to-[#DA880F]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* header row */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={() => go(step - 1)}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        ) : (
          <span />
        )}
        <span className="text-[10px] text-neutral-400 tracking-widest uppercase">
          Step {step + 1} of {TOTAL}
        </span>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="w-full"
          >
            {/* ──── STEP 0: destination confidence ──── */}
            {step === 0 && (
              <StepWrapper
                title="Let's plan your trip"
                subtitle="Do you already know where you want to go?"
              >
                <div className="space-y-3 mt-6">
                  <ChoiceCard
                    icon={<MapPin className="w-5 h-5" />}
                    label="Yes, I know my destination"
                    sub="I have a place in mind"
                    active={form.destinationKnown}
                    onClick={() => {
                      set("destinationKnown", true);
                      go(1);
                    }}
                  />
                  <ChoiceCard
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Suggest destinations for me"
                    sub="Help me discover places"
                    active={!form.destinationKnown}
                    onClick={() => {
                      set("destinationKnown", false);
                      go(1);
                    }}
                  />
                </div>
              </StepWrapper>
            )}

            {/* ──── STEP 1: destination / preferences ──── */}
            {step === 1 && form.destinationKnown && (
              <StepWrapper
                title="Where are you going?"
                subtitle="Type a city, town, or region in India"
              >
                <div className="mt-5 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g., Manali, Goa, Kasol, Jaipur…"
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                    className="w-full h-12 pl-11 pr-4 text-sm rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:border-[#DA880F] focus:ring-2 focus:ring-[#DA880F]/10 outline-none transition-all placeholder:text-neutral-400"
                  />
                </div>
              </StepWrapper>
            )}

            {step === 1 && !form.destinationKnown && (
              <StepWrapper
                title="What kind of trip excites you?"
                subtitle="Pick one or more — AI will find the perfect destination"
              >
                <div className="grid grid-cols-2 gap-3 mt-5">
                  {TRIP_PREFERENCES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => toggleArr("tripPreferences", id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all",
                        form.tripPreferences.includes(id)
                          ? "border-[#DA880F] bg-[#DA880F]/5 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          form.tripPreferences.includes(id)
                            ? "text-[#DA880F]"
                            : "text-neutral-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          form.tripPreferences.includes(id)
                            ? "text-[#DA880F]"
                            : "text-neutral-700"
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* origin city when suggesting */}
                <div className="mt-5">
                  <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                    Where are you traveling from?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Delhi, Mumbai, Bangalore…"
                    value={form.travelFrom}
                    onChange={(e) => set("travelFrom", e.target.value)}
                    className="w-full h-11 px-4 text-sm rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:border-[#DA880F] focus:ring-2 focus:ring-[#DA880F]/10 outline-none transition-all placeholder:text-neutral-400"
                  />
                </div>

                {/* optional: user can override AI suggestion */}
                {form.tripPreferences.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200"
                  >
                    <p className="text-xs text-neutral-500 mb-2">
                      🎯 AI will pick the best destination based on your preferences, budget & dates. Or type one yourself:
                    </p>
                    <input
                      type="text"
                      placeholder="Leave empty to let AI decide…"
                      value={form.destination}
                      onChange={(e) => set("destination", e.target.value)}
                      className="w-full h-10 px-3 text-sm rounded-xl border border-neutral-200 bg-white focus:border-[#DA880F] focus:ring-2 focus:ring-[#DA880F]/10 outline-none transition-all placeholder:text-neutral-400"
                    />
                  </motion.div>
                )}
              </StepWrapper>
            )}

            {/* ──── STEP 2: dates ──── */}
            {step === 2 && (
              <StepWrapper
                title="When are you travelling?"
                subtitle="Pick your travel dates"
              >
                <div className="mt-5 space-y-3">
                  <DateField
                    label="Start date"
                    value={form.dateRange.start}
                    onChange={(v) =>
                      set("dateRange", { ...form.dateRange, start: v })
                    }
                  />
                  <DateField
                    label="End date"
                    value={form.dateRange.end}
                    onChange={(v) =>
                      set("dateRange", { ...form.dateRange, end: v })
                    }
                    min={form.dateRange.start}
                  />
                  {tripDays && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-[#DA880F] font-medium pt-1"
                    >
                      {tripDays} {tripDays === 1 ? "day" : "days"} trip
                    </motion.p>
                  )}
                </div>
              </StepWrapper>
            )}

            {/* ──── STEP 3: travelers ──── */}
            {step === 3 && (
              <StepWrapper
                title="Who's travelling?"
                subtitle="Select your travel group"
              >
                <div className="grid grid-cols-2 gap-3 mt-5">
                  {TRAVEL_TYPES.map(({ id, label, sub, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => set("travelType", id)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-5 rounded-2xl border transition-all",
                        form.travelType === id
                          ? "border-[#DA880F] bg-[#DA880F]/5 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6",
                          form.travelType === id
                            ? "text-[#DA880F]"
                            : "text-neutral-400"
                        )}
                      />
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            form.travelType === id
                              ? "text-[#DA880F]"
                              : "text-neutral-700"
                          )}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* counters */}
                {form.travelType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-5 space-y-3 overflow-hidden"
                  >
                    <Counter
                      label="Adults"
                      value={form.travelers.adults}
                      onMinus={() => adjustCount("adults", -1)}
                      onPlus={() => adjustCount("adults", 1)}
                    />
                    <Counter
                      label="Children"
                      value={form.travelers.children}
                      onMinus={() => adjustCount("children", -1)}
                      onPlus={() => adjustCount("children", 1)}
                    />
                  </motion.div>
                )}
              </StepWrapper>
            )}

            {/* ──── STEP 4: budget ──── */}
            {step === 4 && (
              <StepWrapper
                title="What's your budget?"
                subtitle="Per person, total trip cost"
              >
                <div className="mt-6">
                  {/* current value */}
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-[color:var(--color-navy)]">
                      ₹{Number(form.budget).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* slider */}
                  <input
                    type="range"
                    min={5000}
                    max={50000}
                    step={1000}
                    value={form.budget}
                    onChange={(e) => set("budget", e.target.value)}
                    className="w-full accent-[#DA880F] h-2 rounded-full appearance-none bg-neutral-100 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#DA880F] [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-neutral-400">₹5,000</span>
                    <span className="text-[10px] text-neutral-400">₹50,000</span>
                  </div>

                  {/* quick picks */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {BUDGET_MARKS.map((v) => (
                      <button
                        key={v}
                        onClick={() => set("budget", String(v))}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          Number(form.budget) === v
                            ? "bg-[#DA880F] text-white shadow-sm"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                      >
                        ₹{v.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>

                  {/* flexibility toggle */}
                  <div className="flex items-center gap-3 mt-6 p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/60">
                    <span className="text-sm text-neutral-700 flex-1">
                      Budget flexibility
                    </span>
                    <div className="flex bg-neutral-200/60 rounded-full p-0.5">
                      {(["strict", "flexible"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => set("budgetFlexibility", opt)}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize",
                            form.budgetFlexibility === opt
                              ? "bg-white shadow-sm text-neutral-800"
                              : "text-neutral-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* ──── STEP 5: trip style ──── */}
            {step === 5 && (
              <StepWrapper
                title="What's your trip style?"
                subtitle="Select all that apply"
              >
                <div className="flex flex-wrap gap-2 mt-5">
                  {VIBES.map(({ id, label, icon: Icon }) => {
                    const active = form.travelVibe.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleArr("travelVibe", id)}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all",
                          active
                            ? "border-[#DA880F] bg-[#DA880F]/5 text-[#DA880F] shadow-sm"
                            : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </StepWrapper>
            )}

            {/* ──── STEP 6: review & generate ──── */}
            {step === 6 && (
              <StepWrapper
                title="Ready to plan your trip?"
                subtitle="Here's what we know so far"
              >
                <div className="mt-5 space-y-3">
                  <SummaryRow
                    label="Destination"
                    value={form.destination || "✨ AI will suggest based on your preferences"}
                  />
                  {form.travelFrom && (
                    <SummaryRow
                      label="From"
                      value={form.travelFrom}
                    />
                  )}
                  {tripDays && (
                    <SummaryRow
                      label="Duration"
                      value={`${tripDays} days`}
                    />
                  )}
                  <SummaryRow
                    label="Travelers"
                    value={`${form.travelers.adults} adult${form.travelers.adults > 1 ? "s" : ""}${form.travelers.children ? `, ${form.travelers.children} child${form.travelers.children > 1 ? "ren" : ""}` : ""} · ${form.travelType || "—"}`}
                  />
                  <SummaryRow
                    label="Budget"
                    value={`₹${Number(form.budget).toLocaleString("en-IN")} per person (${form.budgetFlexibility})`}
                  />
                  {form.travelVibe.length > 0 && (
                    <SummaryRow
                      label="Style"
                      value={form.travelVibe.join(", ")}
                    />
                  )}
                  {form.tripPreferences.length > 0 && (
                    <SummaryRow
                      label="Preferences"
                      value={form.tripPreferences.join(", ")}
                    />
                  )}
                </div>

                {/* generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-8 h-12 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#DA880F]/25 hover:shadow-xl hover:shadow-[#DA880F]/35 disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Designing your itinerary…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create My Trip
                    </>
                  )}
                </button>
              </StepWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer continue */}
      {step < 6 && step !== 0 && (
        <div className="px-6 pb-5 pt-2">
          <button
            disabled={!canNext()}
            onClick={() => go(step + 1)}
            className={cn(
              "w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              canNext()
                ? "bg-[color:var(--color-navy)] text-white hover:opacity-90 active:scale-[0.98]"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            Continue
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── sub‑components ─────────────────────────────────────────── */

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-2">
      <h2 className="text-xl font-semibold text-[color:var(--color-navy)] tracking-tight leading-snug">
        {title}
      </h2>
      <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
      {children}
    </div>
  );
}

function ChoiceCard({
  icon,
  label,
  sub,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all group",
        active
          ? "border-[#DA880F] bg-[#DA880F]/5"
          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          active ? "bg-[#DA880F]/10 text-[#DA880F]" : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/60"
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
      </div>
      <ArrowRight className="w-4 h-4 ml-auto text-neutral-300 group-hover:text-neutral-400 transition-colors" />
    </button>
  );
}

function DateField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  return (
    <div className="relative">
      <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-1 block">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-11 pr-4 text-sm rounded-2xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:border-[#DA880F] focus:ring-2 focus:ring-[#DA880F]/10 outline-none transition-all"
        />
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/60">
      <span className="text-sm text-neutral-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onMinus}
          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors text-sm"
        >
          −
        </button>
        <span className="text-sm font-semibold w-5 text-center text-[color:var(--color-navy)]">
          {value}
        </span>
        <button
          onClick={onPlus}
          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs text-neutral-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-800 text-right max-w-[60%] capitalize">
        {value}
      </span>
    </div>
  );
}


