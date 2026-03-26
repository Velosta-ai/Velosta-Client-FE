"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Sparkles,
  Globe,
  RotateCcw,
  Share2,
  Compass,
  Utensils,
  Bed,
  IndianRupee,
  Mountain,
  TreePine,
  Zap,
  Coffee,
  ArrowRight,
  Send,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Lightbulb,
  PieChart,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  Check,
} from "lucide-react";
import TripStepper, { type TripFormData } from "./trip-stepper";
import { ItineraryPDFExport } from "./itinerary-pdf-export";
import { useUser } from "@/app/utils/context";

type GenerationPhase = "analyzing" | "destination" | "itinerary" | "insights";

interface ItineraryData {
  summary?: string;
  destination?: string;
  duration?: string;
  totalBudget?: string;
  budgetBreakdown?: Record<string, string>;
  itineraryTable?: any[];
  expenseSummary?: any;
  localTips?: string[];
  totalEstimatedCost?: string;
  modificationsApplied?: string[];
  isTextResponse?: boolean;
  message?: string;
}

/* ─── activity icon helper ──────────────────────────────────── */
function getActivityIcon(activity: string) {
  const lower = activity.toLowerCase();
  if (lower.includes("trek") || lower.includes("hike"))
    return <Mountain className="w-3.5 h-3.5 text-green-600" />;
  if (lower.includes("breakfast") || lower.includes("cafe") || lower.includes("coffee"))
    return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
  if (lower.includes("lunch") || lower.includes("dinner") || lower.includes("food") || lower.includes("restaurant"))
    return <Utensils className="w-3.5 h-3.5 text-orange-500" />;
  if (lower.includes("hotel") || lower.includes("check-in") || lower.includes("stay") || lower.includes("resort"))
    return <Bed className="w-3.5 h-3.5 text-indigo-500" />;
  if (lower.includes("temple") || lower.includes("museum") || lower.includes("fort") || lower.includes("palace"))
    return <Compass className="w-3.5 h-3.5 text-purple-500" />;
  if (lower.includes("market") || lower.includes("shop"))
    return <MapPin className="w-3.5 h-3.5 text-pink-500" />;
  if (lower.includes("viewpoint") || lower.includes("valley") || lower.includes("lake") || lower.includes("nature"))
    return <TreePine className="w-3.5 h-3.5 text-emerald-600" />;
  if (lower.includes("adventure") || lower.includes("river") || lower.includes("rafting") || lower.includes("paraglid"))
    return <Zap className="w-3.5 h-3.5 text-yellow-600" />;
  return <MapPin className="w-3.5 h-3.5 text-neutral-400" />;
}

/* ─── WhatsApp share helper ─────────────────────────────────── */
function shareWhatsApp(itinerary: ItineraryData) {
  if (!itinerary) return;

  let text = "";

  // Header
  text += `*${itinerary.destination} Trip Itinerary*\n`;
  text += `--------------------\n\n`;

  // Trip overview
  if (itinerary.duration) text += `Duration: ${itinerary.duration}\n`;
  if (itinerary.totalEstimatedCost) text += `Budget: ${itinerary.totalEstimatedCost}\n`;
  text += `\n`;

  // Summary
  if (itinerary.summary) {
    text += `*Trip Summary*\n`;
    text += `${itinerary.summary}\n\n`;
  }

  // Budget breakdown
  if (itinerary.budgetBreakdown) {
    text += `*Budget Breakdown*\n`;
    Object.entries(itinerary.budgetBreakdown).forEach(([key, value]) => {
      text += `> ${key}: ${value}\n`;
    });
    text += `\n`;
  }

  // Day-by-day itinerary
  text += `*Day-by-Day Itinerary*\n`;
  text += `--------------------\n\n`;

  itinerary.itineraryTable?.forEach((day: any) => {
    text += `*Day ${day.day}: ${day.theme}*`;
    if (day.dailyCost) text += ` (${day.dailyCost})`;
    text += `\n\n`;

    // Activities with descriptions
    day.rows?.forEach((r: any) => {
      text += `  *${r.time}* - ${r.activity}\n`;
      if (r.description) text += `      _${r.description}_\n`;
      const meta: string[] = [];
      if (r.distance) meta.push(r.distance);
      if (r.pricing) meta.push(r.pricing);
      if (meta.length) text += `      ${meta.join(" | ")}\n`;
      text += `\n`;
    });

    // Meals
    if (day.meals) {
      text += `  *Meals*\n`;
      if (day.meals.breakfast) text += `      Breakfast: ${day.meals.breakfast}\n`;
      if (day.meals.lunch) text += `      Lunch: ${day.meals.lunch}\n`;
      if (day.meals.dinner) text += `      Dinner: ${day.meals.dinner}\n`;
      text += `\n`;
    }

    // Accommodation
    if (day.accommodation) {
      text += `  *Stay:* ${day.accommodation}\n`;
      text += `\n`;
    }

    text += `--------------------\n\n`;
  });

  // Expense summary
  if (itinerary.expenseSummary) {
    if (itinerary.expenseSummary.totalPerPerson) {
      text += `*Per Person:* ${itinerary.expenseSummary.totalPerPerson}\n`;
    }
    if (itinerary.expenseSummary.totalForGroup) {
      text += `*Group Total:* ${itinerary.expenseSummary.totalForGroup}\n`;
    }
    text += `\n`;
  }

  // Cost saving tips
  if (itinerary.expenseSummary?.costSavingTips?.length) {
    text += `*Money Saving Tips*\n`;
    itinerary.expenseSummary.costSavingTips.forEach((tip: string) => {
      text += `- ${tip}\n`;
    });
    text += `\n`;
  }

  // Local tips
  if (itinerary.localTips?.length) {
    text += `*Local Tips*\n`;
    itinerary.localTips.forEach((tip: string) => {
      text += `- ${tip}\n`;
    });
    text += `\n`;
  }

  text += `--------------------\n`;
  text += `_Generated with Velosta AI_\n`;
  text += `velosta.in`;

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}

/* helper for WhatsApp activity emojis — no longer needed, removed emojis */

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function VelostaAITripPlanner() {
  const { accessToken, refreshAccessToken } = useUser();

  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [tripInputData, setTripInputData] = useState<TripFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>("analyzing");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modificationMessage, setModificationMessage] = useState<string | null>(null);
  const [modifyInput, setModifyInput] = useState("");

  /* save itinerary state */
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  /* panel visibility — desktop only */
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [rightSection, setRightSection] = useState<string | null>("budget");

  const scrollRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_URL;

  /* ─── mobile detection ──────────────────────────────────────── */
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"plan" | "setup" | "insights">("setup");

  useEffect(() => {
    const chk = () => setIsMobile(window.innerWidth < 768);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);

  useEffect(() => {
    if (isMobile && isGenerating) setMobileTab("plan");
  }, [isMobile, isGenerating]);
  useEffect(() => {
    if (isMobile && itinerary) setMobileTab("plan");
  }, [isMobile, itinerary]);

  /* ─── generation ────────────────────────────────────────────── */
  const handleGenerate = useCallback(
    async (formData: TripFormData) => {
      setIsGenerating(true);
      setError(null);
      setItinerary(null);
      setTripInputData(formData);
      setGenerationProgress(0);
      setGenerationPhase("analyzing");
      setModificationMessage(null);

      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 0.5, 85);
        setGenerationProgress(progress);
        if (progress > 15 && progress <= 35) setGenerationPhase("destination");
        else if (progress > 35 && progress <= 65) setGenerationPhase("itinerary");
        else if (progress > 65) setGenerationPhase("insights");
      }, 200);

      try {
        const res = await fetch(`${API_URL}/api/velosta-ai/ai-planner-stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to generate trip plan");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              try {
                const d = JSON.parse(line.slice(6));
                if (d.error) throw new Error(d.error);
                if (d.done) break;
                if (d.content) {
                  acc += d.content;
                  try {
                    const c = acc.trim();
                    if (c.endsWith("}")) {
                      setItinerary(JSON.parse(c));
                      setGenerationProgress(95);
                    }
                  } catch { /* not complete yet */ }
                }
              } catch (e) {
                if (e instanceof Error && e.message !== "Failed to generate trip plan") continue;
                throw e;
              }
            }
          }
        }

        if (acc.trim()) {
          let ct = acc.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
          const f = ct.indexOf("{"), l = ct.lastIndexOf("}");
          if (f !== -1 && l !== -1) ct = ct.slice(f, l + 1);
          setItinerary(JSON.parse(ct));
        }
        setGenerationProgress(100);
        setLeftOpen(false);
        setRightOpen(true);
      } catch (err: any) {
        setError(err.message || "Unable to generate a trip plan right now. Please try again.");
      } finally {
        clearInterval(interval);
        setIsGenerating(false);
      }
    },
    [API_URL, accessToken]
  );

  /* ─── modification ──────────────────────────────────────────── */
  const handleModify = useCallback(
    async (message: string) => {
      if (!itinerary || !tripInputData) return;
      setIsModifying(true);
      setModificationMessage(null);
      try {
        const res = await fetch(`${API_URL}/api/velosta-ai/ai-planner`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            isModificationRequest: true,
            userSaid: message,
            currentItinerary: itinerary,
            context: tripInputData,
            conversationHistory: [],
          }),
        });
        if (!res.ok) throw new Error("Failed to modify trip plan");
        const data = await res.json();
        if (data.isTextResponse) {
          setModificationMessage(data.message);
        } else {
          setItinerary(data);
          setModificationMessage(
            data.modificationsApplied
              ? `Updated: ${data.modificationsApplied.join(", ")}`
              : "Trip plan updated successfully!"
          );
        }
      } catch {
        setModificationMessage("Unable to modify the trip plan. Please try again.");
      } finally {
        setIsModifying(false);
      }
    },
    [itinerary, tripInputData, API_URL, accessToken]
  );

  const sendModify = () => {
    if (modifyInput.trim() && !isModifying) {
      handleModify(modifyInput.trim());
      setModifyInput("");
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setTripInputData(null);
    setError(null);
    setModificationMessage(null);
    setLeftOpen(true);
    setRightOpen(true);
    setGenerationProgress(0);
    setMobileTab("setup");
    setIsSaved(false);
  };

  /* ─── save itinerary ────────────────────────────────────────── */
  const handleSaveItinerary = useCallback(async () => {
    if (!itinerary || !tripInputData || !accessToken || isSaving) return;
    setIsSaving(true);

    const buildBody = () => JSON.stringify({
      destination: itinerary.destination || "Unknown",
      startDate: tripInputData.dateRange?.start || new Date().toISOString(),
      endDate: tripInputData.dateRange?.end || new Date().toISOString(),
      preferences: {
        travelType: tripInputData.travelType,
        travelVibe: tripInputData.travelVibe,
        budget: tripInputData.budget,
        budgetFlexibility: tripInputData.budgetFlexibility,
        travelers: tripInputData.travelers,
        travelFrom: tripInputData.travelFrom,
        tripPreferences: tripInputData.tripPreferences,
      },
      plan: itinerary,
    });

    try {
      let token = accessToken;
      let res = await fetch(`${API_URL}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: buildBody(),
      });

      // If unauthorized, try refreshing the token once and retry
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Session expired. Please sign in again.");
        token = newToken;
        res = await fetch(`${API_URL}/api/trips`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: buildBody(),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save");
      }
      setIsSaved(true);
    } catch (err: any) {
      console.error("Save trip error:", err);
      setModificationMessage(err.message || "Unable to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [itinerary, tripInputData, accessToken, refreshAccessToken, API_URL, isSaving]);

  /* ─── quick modify chips ────────────────────────────────────── */
  const QUICK_MODS = [
    "Add more adventure",
    "Make it relaxed",
    "Reduce budget",
    "Add hidden gems",
    "More food spots",
    "Add photography spots",
  ];

  /* trip duration helper */
  const tripDays = (() => {
    if (!tripInputData?.dateRange?.start || !tripInputData?.dateRange?.end) return null;
    const d = (new Date(tripInputData.dateRange.end).getTime() - new Date(tripInputData.dateRange.start).getTime()) / 86400000;
    return d > 0 ? d : null;
  })();

  /* personalization label */
  const personalizationNote = (() => {
    if (!tripInputData) return null;
    const parts: string[] = [];
    if (tripInputData.travelVibe.length)
      parts.push(tripInputData.travelVibe.slice(0, 3).join(", "));
    if (tripInputData.travelType) parts.push(`${tripInputData.travelType} travel`);
    if (!parts.length) return null;
    return `Designed for your interest in ${parts.join(" and ")}`;
  })();

  /* budget bar helper */
  const budgetBars = (() => {
    if (!itinerary?.budgetBreakdown) return [];
    const entries = Object.entries(itinerary.budgetBreakdown);
    const nums = entries.map(([k, v]) => {
      const n = parseInt(String(v).replace(/[^\d]/g, ""), 10) || 0;
      return { key: k, value: v as string, num: n };
    });
    const total = nums.reduce((s, n) => s + n.num, 0) || 1;
    return nums.map((n) => ({ ...n, pct: Math.round((n.num / total) * 100) }));
  })();

  /* ═══════════════ MOBILE LAYOUT ═══════════════ */
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-72px)] flex flex-col bg-white">
        {itinerary && (
          <div className="flex border-b border-neutral-100">
            {(["setup", "plan", "insights"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMobileTab(t)}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${mobileTab === t ? "text-[#DA880F] border-b-2 border-[#DA880F]" : "text-neutral-400"}`}
              >
                {t === "setup" ? "Setup" : t === "plan" ? "Itinerary" : "Insights"}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {mobileTab === "setup" && (
            <TripStepper onGenerate={handleGenerate} isGenerating={isGenerating} />
          )}
          {mobileTab === "plan" && (
            <div className="h-full overflow-y-auto no-scrollbar">
              {isGenerating && !itinerary && (
                <LoadingExperience phase={generationPhase} progress={generationProgress} />
              )}
              {error && <ErrorState error={error} onReset={handleReset} />}
              {itinerary && (
                <ItineraryView
                  itinerary={itinerary}
                  tripInputData={tripInputData}
                  tripDays={tripDays}
                  personalizationNote={personalizationNote}
                  modificationMessage={modificationMessage}
                  setModificationMessage={setModificationMessage}
                  onReset={handleReset}
                  onShare={() => shareWhatsApp(itinerary)}
                  onSave={handleSaveItinerary}
                  isSaving={isSaving}
                  isSaved={isSaved}
                  quickMods={QUICK_MODS}
                  onQuickMod={handleModify}
                  isModifying={isModifying}
                  modifyInput={modifyInput}
                  setModifyInput={setModifyInput}
                  sendModify={sendModify}
                />
              )}
              {!isGenerating && !itinerary && !error && (
                <EmptyState onStart={() => setMobileTab("setup")} />
              )}
            </div>
          )}
          {mobileTab === "insights" && itinerary && (
            <RightInsightsPanel
              itinerary={itinerary}
              tripData={tripInputData}
              budgetBars={budgetBars}
              rightSection={rightSection}
              setRightSection={setRightSection}
            />
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ DESKTOP LAYOUT ═══════════════ */
  return (
    <div className="h-[calc(100vh-72px)] flex bg-neutral-50/40">
      {/* LEFT — stepper */}
      
      <AnimatePresence>
        {leftOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-r border-neutral-100 overflow-hidden shrink-0"
          >
            <TripStepper onGenerate={handleGenerate} isGenerating={isGenerating} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER — itinerary */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setLeftOpen(!leftOpen)} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400">
              {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            {itinerary?.destination ? (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#DA880F]" />
                <h1 className="text-sm font-semibold text-[color:var(--color-navy)]">{itinerary.destination}</h1>
                {itinerary.duration && (
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1"><Clock className="w-3 h-3" />{itinerary.duration}</span>
                )}
              </div>
            ) : (
              <h1 className="text-sm font-semibold text-[color:var(--color-navy)]">Your Trip Plan</h1>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {itinerary && (
              <>
                <button
                  onClick={handleSaveItinerary}
                  disabled={isSaving || isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isSaved ? "text-green-600 bg-green-50" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                >
                  {isSaved ? <BookmarkCheck className="w-3 h-3" /> : isSaving ? <div className="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" /> : <Bookmark className="w-3 h-3" />}
                  {isSaved ? "Saved" : isSaving ? "Saving…" : "Save"}
                </button>
                <button onClick={() => shareWhatsApp(itinerary)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Share2 className="w-3 h-3" />Share
                </button>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  <RotateCcw className="w-3 h-3" />New
                </button>
              </>
            )}
            <button onClick={() => setRightOpen(!rightOpen)} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400">
              {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
          {isGenerating && !itinerary && <LoadingExperience phase={generationPhase} progress={generationProgress} />}
          {error && <ErrorState error={error} onReset={handleReset} />}
          {!isGenerating && !itinerary && !error && <EmptyState onStart={() => setLeftOpen(true)} />}
          {itinerary && !itinerary.isTextResponse && (
            <ItineraryView
              itinerary={itinerary}
              tripInputData={tripInputData}
              tripDays={tripDays}
              personalizationNote={personalizationNote}
              modificationMessage={modificationMessage}
              setModificationMessage={setModificationMessage}
              onReset={handleReset}
              onShare={() => shareWhatsApp(itinerary)}
              onSave={handleSaveItinerary}
              isSaving={isSaving}
              isSaved={isSaved}
              quickMods={QUICK_MODS}
              onQuickMod={handleModify}
              isModifying={isModifying}
              modifyInput={modifyInput}
              setModifyInput={setModifyInput}
              sendModify={sendModify}
            />
          )}
        </div>
      </div>

      {/* RIGHT — insights */}
      <AnimatePresence>
        {rightOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 310, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-l border-neutral-100 overflow-hidden shrink-0"
          >
            <RightInsightsPanel
              itinerary={itinerary}
              tripData={tripInputData}
              budgetBars={budgetBars}
              rightSection={rightSection}
              setRightSection={setRightSection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB‑COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Empty state ──────────────────────────────────────────── */
function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-3xl bg-[#DA880F]/5 rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-[#DA880F]/10 -rotate-3" />
          <div className="relative w-full h-full rounded-3xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
            <Compass className="w-8 h-8 text-[#DA880F]" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[color:var(--color-navy)] mb-2 tracking-tight">Where to next?</h2>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
          Your smart travel companion is ready. Let&apos;s plan a trip that feels like it was made just for you.
        </p>
        <button onClick={onStart} className="px-6 py-2.5 text-sm font-semibold rounded-2xl text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))" }}>
          Start Planning
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Loading experience ───────────────────────────────────── */
const PHASE_MSG: Record<string, { title: string; sub: string }> = {
  analyzing: { title: "Understanding your preferences", sub: "Analyzing travel style & requirements…" },
  destination: { title: "Exploring your destination", sub: "Finding the best experiences…" },
  itinerary: { title: "Crafting your itinerary", sub: "Building day-by-day activities & stays…" },
  insights: { title: "Adding travel insights", sub: "Budget breakdowns & local tips…" },
};

function LoadingExperience({ phase, progress }: { phase: string; progress: number }) {
  const msg = PHASE_MSG[phase] || PHASE_MSG.analyzing;
  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
        {/* animated ring */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" className="stroke-neutral-100" strokeWidth="2" />
            <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#DA880F" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="226" initial={{ strokeDashoffset: 226 }} animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Compass className="w-6 h-6 text-[color:var(--color-navy)]" />
            </motion.div>
          </div>
        </div>
        <motion.div key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h3 className="text-lg font-semibold text-[color:var(--color-navy)] mb-1">{msg.title}</h3>
          <p className="text-sm text-neutral-500">{msg.sub}</p>
        </motion.div>
        <div className="w-full max-w-xs mx-auto">
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#DA880F]/70 to-[#DA880F]" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Error state ──────────────────────────────────────────── */
function ErrorState({ error, onReset }: { error: string; onReset: () => void }) {
  return (
    <div className="h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><span className="text-xl">😔</span></div>
        <h3 className="text-base font-semibold text-[color:var(--color-navy)] mb-2">Something went wrong</h3>
        <p className="text-sm text-neutral-500 mb-4">{error}</p>
        <button onClick={onReset} className="px-5 py-2 text-sm font-medium rounded-xl text-white" style={{ background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))" }}>Try Again</button>
      </motion.div>
    </div>
  );
}

/* ─── Itinerary view ───────────────────────────────────────── */
function ItineraryView({
  itinerary, tripInputData, tripDays, personalizationNote,
  modificationMessage, setModificationMessage,
  onReset, onShare, onSave, isSaving, isSaved,
  quickMods, onQuickMod, isModifying,
  modifyInput, setModifyInput, sendModify,
}: {
  itinerary: ItineraryData;
  tripInputData: TripFormData | null;
  tripDays: number | null;
  personalizationNote: string | null;
  modificationMessage: string | null;
  setModificationMessage: (m: string | null) => void;
  onReset: () => void;
  onShare: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
  quickMods: string[];
  onQuickMod: (msg: string) => void;
  isModifying: boolean;
  modifyInput: string;
  setModifyInput: (v: string) => void;
  sendModify: () => void;
}) {
  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* ── Narrative header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--color-brand-start), var(--color-brand), var(--color-navy))" }} />
          <div className="px-6 py-6">
            {/* personalization */}
            {personalizationNote && (
              <p className="text-[11px] text-[#DA880F] font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {personalizationNote}
              </p>
            )}
            {/* title */}
            <h2 className="text-2xl font-bold text-[color:var(--color-navy)] tracking-tight leading-snug">
              Your {itinerary.destination} {tripInputData?.travelType === "couple" ? "Getaway" : tripInputData?.travelType === "solo" ? "Solo Journey" : "Adventure"}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2.5">
              {itinerary.duration && (
                <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" />{itinerary.duration}</span>
              )}
              {tripInputData?.travelType && (
                <span className="text-xs text-neutral-500 capitalize flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />{tripInputData.travelType} trip
                </span>
              )}
              {itinerary.totalEstimatedCost && (
                <span className="text-xs text-[#DA880F] font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#DA880F]/40" />{itinerary.totalEstimatedCost}
                </span>
              )}
            </div>
            {/* narrative summary */}
            {itinerary.summary && (
              <p className="text-sm text-neutral-600 mt-4 leading-relaxed">{itinerary.summary}</p>
            )}
            {/* action row */}
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={onSave}
                disabled={isSaving || isSaved}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                  isSaved
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600"
                }`}
              >
                {isSaved ? (
                  <><BookmarkCheck className="w-3 h-3" />Saved to My Trips</>
                ) : isSaving ? (
                  <><div className="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />Saving…</>
                ) : (
                  <><Bookmark className="w-3 h-3" />Save Itinerary</>
                )}
              </button>
              <button onClick={onShare} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors">
                <Share2 className="w-3 h-3" />WhatsApp
              </button>
              {itinerary && tripInputData && (
                <ItineraryPDFExport itineraryData={itinerary} tripData={tripInputData} />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Modification message ── */}
      <AnimatePresence>
        {modificationMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 flex-1">{modificationMessage}</p>
              <button onClick={() => setModificationMessage(null)} className="text-blue-400 hover:text-blue-600 text-xs">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Day cards ── */}
      {itinerary.itineraryTable && itinerary.itineraryTable.length > 0 && (
        <div className="space-y-0">
          {itinerary.itineraryTable.map((day: any, idx: number) => (
            <DayCard key={`d-${day.day}-${idx}`} day={day} index={idx} isLast={idx === itinerary.itineraryTable!.length - 1} />
          ))}
        </div>
      )}

      {/* ── Quick modify controls ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#DA880F]" />Refine your trip
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {quickMods.map((m) => (
            <button
              key={m}
              onClick={() => onQuickMod(m)}
              disabled={isModifying}
              className="px-3.5 py-2 text-xs font-medium rounded-full border border-neutral-200 text-neutral-600 hover:border-[#DA880F] hover:text-[#DA880F] hover:bg-[#DA880F]/5 transition-all disabled:opacity-50"
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type your own change…"
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendModify()}
            disabled={isModifying}
            className="flex-1 h-10 px-4 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:border-[#DA880F] focus:ring-2 focus:ring-[#DA880F]/10 outline-none transition-all placeholder:text-neutral-400 disabled:opacity-50"
          />
          <button onClick={sendModify} disabled={!modifyInput.trim() || isModifying} className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all shrink-0" style={{ background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))" }}>
            {isModifying ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </motion.div>

      <div className="h-10" />
    </div>
  );
}

/* ─── Day card (redesigned) ────────────────────────────────── */
function DayCard({ day, index, isLast }: { day: any; index: number; isLast: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.12, ease: "easeOut" }} className="relative">
      {/* timeline line */}
      <div className="absolute left-[21px] top-0 bottom-0 z-0">
        <div className={`w-px h-full ${isLast ? "bg-gradient-to-b from-neutral-200 to-transparent" : "bg-neutral-200"}`} />
      </div>

      <div className="relative flex gap-4">
        {/* day dot */}
        <div className="relative z-10 shrink-0">
          <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#DA880F]/90 to-[#DA880F] flex items-center justify-center shadow-md shadow-[#DA880F]/20">
            <span className="text-white text-[11px] font-bold">D{day.day}</span>
          </div>
        </div>

        {/* card */}
        <div className="flex-1 pb-5 min-w-0">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* header */}
            <div className="px-5 py-4 flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[color:var(--color-navy)] leading-snug">Day {day.day}</h3>
                <p className="text-xs text-[#DA880F] font-medium mt-0.5 flex items-center gap-1"><Compass className="w-3 h-3" />{day.theme}</p>
              </div>
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{day.dailyCost}</span>
            </div>

            {/* activities */}
            <div className="px-5 pb-1">
              {day.rows?.map((act: any, ai: number) => (
                <div key={ai} className="flex gap-3.5 py-3.5 border-b border-neutral-50 last:border-0">
                  {/* icon + time */}
                  <div className="shrink-0 flex flex-col items-center gap-1 w-14 pt-0.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100">
                      {getActivityIcon(act.activity)}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">{act.time}</span>
                  </div>
                  {/* details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-medium text-[color:var(--color-navy)] leading-snug">{act.activity}</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{act.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {act.distance && <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-medium"><ArrowRight className="w-2.5 h-2.5" />{act.distance}</span>}
                      {act.pricing && <span className="inline-flex items-center gap-1 text-[10px] text-[#DA880F] font-medium"><IndianRupee className="w-2.5 h-2.5" />{act.pricing}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* meals & stay */}
            <div className="px-5 py-3.5 bg-neutral-50/60 border-t border-neutral-100 space-y-2">
              {day.meals && (
                <div className="flex items-start gap-2">
                  <Utensils className="w-3.5 h-3.5 text-[#DA880F] mt-0.5 shrink-0" />
                  <div className="text-[11px] text-neutral-600 leading-relaxed space-y-0.5">
                    {day.meals.breakfast && <p><span className="font-medium text-neutral-700">Breakfast:</span> {day.meals.breakfast}</p>}
                    {day.meals.lunch && <p><span className="font-medium text-neutral-700">Lunch:</span> {day.meals.lunch}</p>}
                    {day.meals.dinner && <p><span className="font-medium text-neutral-700">Dinner:</span> {day.meals.dinner}</p>}
                  </div>
                </div>
              )}
              {day.accommodation && (
                <div className="flex items-start gap-2">
                  <Bed className="w-3.5 h-3.5 text-[#DA880F] mt-0.5 shrink-0" />
                  <p className="text-[11px] text-neutral-600 leading-relaxed"><span className="font-medium text-neutral-700">Stay:</span> {day.accommodation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Right insights panel ─────────────────────────────────── */
function RightInsightsPanel({
  itinerary, tripData, budgetBars, rightSection, setRightSection,
}: {
  itinerary: ItineraryData | null;
  tripData: TripFormData | null;
  budgetBars: { key: string; value: string; pct: number }[];
  rightSection: string | null;
  setRightSection: (s: string | null) => void;
}) {
  const toggle = (s: string) => setRightSection(rightSection === s ? null : s);

  if (!itinerary) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-purple-500" /></div>
            <h2 className="text-base font-semibold text-[color:var(--color-navy)]">Travel Insights</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-neutral-200 mx-auto mb-2" />
            <p className="text-sm text-neutral-400 leading-relaxed">Insights appear after your trip is generated</p>
          </div>
        </div>
      </div>
    );
  }

  const expense = itinerary.expenseSummary;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-purple-500" /></div>
          <h2 className="text-base font-semibold text-[color:var(--color-navy)]">Travel Insights</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
        {/* Where your money goes */}
        {budgetBars.length > 0 && (
          <Collapsible title="Where your money goes" icon={<PieChart className="w-4 h-4 text-[#DA880F]" />} open={rightSection === "budget"} onToggle={() => toggle("budget")}>
            <div className="space-y-3 pt-1">
              {budgetBars.map((b) => (
                <div key={b.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600 capitalize">{b.key}</span>
                    <span className="text-[11px] font-semibold text-[color:var(--color-navy)]">{b.value}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#DA880F]/70 to-[#DA880F]"
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-400">{b.pct}%</span>
                </div>
              ))}
              {itinerary.totalBudget && (
                <div className="pt-2 mt-1 border-t border-neutral-100 flex justify-between">
                  <span className="text-xs font-semibold text-neutral-700">Total Budget</span>
                  <span className="text-xs font-bold text-[#DA880F]">{itinerary.totalBudget}</span>
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {/* Expense details */}
        {expense?.perPersonBreakdown && (
          <Collapsible title="Expense Details" icon={<TrendingDown className="w-4 h-4 text-green-500" />} open={rightSection === "expense"} onToggle={() => toggle("expense")}>
            <div className="space-y-3 pt-1">
              {Object.entries(expense.perPersonBreakdown).map(([cat, data]: [string, any]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-neutral-700 capitalize">{cat}</span>
                    <span className="text-[11px] font-semibold text-[#DA880F]">{data.amount}</span>
                  </div>
                  {data.details && (
                    <ul className="space-y-0.5">{data.details.map((d: string, i: number) => (
                      <li key={i} className="text-[10px] text-neutral-500 pl-2 border-l border-neutral-200">{d}</li>
                    ))}</ul>
                  )}
                </div>
              ))}
              {expense.totalPerPerson && (
                <div className="pt-2 border-t border-neutral-100 space-y-1">
                  <div className="flex justify-between"><span className="text-[11px] text-neutral-600">Per Person</span><span className="text-[11px] font-bold text-[color:var(--color-navy)]">{expense.totalPerPerson}</span></div>
                  {expense.totalForGroup && <div className="flex justify-between"><span className="text-[11px] text-neutral-600">Group Total</span><span className="text-[11px] font-bold text-[#DA880F]">{expense.totalForGroup}</span></div>}
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {/* Cost saving tips */}
        {expense?.costSavingTips?.length > 0 && (
          <Collapsible title="Saving Tips" icon={<TrendingDown className="w-4 h-4 text-blue-500" />} open={rightSection === "tips"} onToggle={() => toggle("tips")}>
            <div className="space-y-2 pt-1">
              {expense.costSavingTips.map((t: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-600"><span className="text-green-500 mt-px">💡</span><span>{t}</span></div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Local tips */}
        {itinerary.localTips && itinerary.localTips.length > 0 && (
          <Collapsible title="Local Tips" icon={<MapPin className="w-4 h-4 text-[#DA880F]" />} open={rightSection === "local"} onToggle={() => toggle("local")}>
            <div className="space-y-2 pt-1">
              {itinerary.localTips.map((t: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-600"><span className="text-[#DA880F]">📌</span><span>{t}</span></div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* PDF export */}
        {tripData && <ItineraryPDFExport itineraryData={itinerary} tripData={tripData} />}
      </div>
    </div>
  );
}

/* ─── Collapsible section ──────────────────────────────────── */
function Collapsible({ title, icon, open, onToggle, children }: { title: string; icon: React.ReactNode; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-semibold text-[color:var(--color-navy)] uppercase tracking-wider">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
