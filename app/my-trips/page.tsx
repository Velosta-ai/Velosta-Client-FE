"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Trash2,
  ArrowRight,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Utensils,
  Bed,
  Mountain,
  TreePine,
  Zap,
  Coffee,
} from "lucide-react";
import Navbar from "@/components/navbar";
import ProtectedRoute from "../utils/protected-routes";
import { useUser } from "../utils/context";

/* ── activity icon ── */
function getActivityIcon(activity: string) {
  const l = activity.toLowerCase();
  if (l.includes("trek") || l.includes("hike")) return <Mountain className="w-3.5 h-3.5 text-green-600" />;
  if (l.includes("breakfast") || l.includes("cafe") || l.includes("coffee")) return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
  if (l.includes("lunch") || l.includes("dinner") || l.includes("food") || l.includes("restaurant")) return <Utensils className="w-3.5 h-3.5 text-orange-500" />;
  if (l.includes("hotel") || l.includes("check-in") || l.includes("stay") || l.includes("resort")) return <Bed className="w-3.5 h-3.5 text-indigo-500" />;
  if (l.includes("temple") || l.includes("museum") || l.includes("fort") || l.includes("palace")) return <Compass className="w-3.5 h-3.5 text-purple-500" />;
  if (l.includes("viewpoint") || l.includes("valley") || l.includes("lake") || l.includes("nature")) return <TreePine className="w-3.5 h-3.5 text-emerald-600" />;
  if (l.includes("adventure") || l.includes("river") || l.includes("rafting") || l.includes("paraglid")) return <Zap className="w-3.5 h-3.5 text-yellow-600" />;
  return <MapPin className="w-3.5 h-3.5 text-neutral-400" />;
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: any;
  plan: any;
  createdAt: string;
}

export default function MyTripsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="w-full">
        <MyTripsContent />
      </main>
    </ProtectedRoute>
  );
}

function MyTripsContent() {
  const { accessToken } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_URL;

  const fetchTrips = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, API_URL]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        if (expandedTrip === id) setExpandedTrip(null);
      }
    } catch (err) {
      console.error("Failed to delete trip:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getDays = (start: string, end: string) => {
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
    return diff > 0 ? Math.round(diff) : 1;
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#DA880F] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading your trips…</p>
        </div>
      </div>
    );
  }

  /* ── empty ── */
  if (trips.length === 0) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-3xl bg-[#DA880F]/5 rotate-6" />
            <div className="absolute inset-0 rounded-3xl bg-[#DA880F]/10 -rotate-3" />
            <div className="relative w-full h-full rounded-3xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
              <Compass className="w-8 h-8 text-[#DA880F]" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2 tracking-tight">No saved trips yet</h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Plan your first trip with Velosta AI and save it here.
          </p>
          <a
            href="/velosta-ai"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-2xl text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))" }}
          >
            <Sparkles className="w-4 h-4" /> Plan a Trip
          </a>
        </motion.div>
      </div>
    );
  }

  /* ── trip list ── */
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">My Trips</h1>
          <p className="text-sm text-neutral-500 mt-1">{trips.length} saved {trips.length === 1 ? "itinerary" : "itineraries"}</p>
        </div>
        <a
          href="/velosta-ai"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))" }}
        >
          <Sparkles className="w-3.5 h-3.5" /> New Trip
        </a>
      </div>

      {/* trips */}
      <div className="space-y-4">
        {trips.map((trip, idx) => {
          const plan = trip.plan;
          const isExpanded = expandedTrip === trip.id;
          const days = getDays(trip.startDate, trip.endDate);
          const prefs = trip.preferences;

          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* trip card header */}
              <div
                className="px-5 py-4 cursor-pointer"
                onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}
              >
                <div className="flex items-start gap-4">
                  {/* icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DA880F]/90 to-[#DA880F] flex items-center justify-center shadow-md shadow-[#DA880F]/20 shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-neutral-800 truncate">
                      {trip.destination}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{days} {days === 1 ? "day" : "days"}
                      </span>
                      {prefs?.travelType && (
                        <>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500 capitalize flex items-center gap-1">
                            <Users className="w-3 h-3" />{prefs.travelType}
                          </span>
                        </>
                      )}
                      {plan?.totalEstimatedCost && (
                        <>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-[#DA880F] font-medium">{plan.totalEstimatedCost}</span>
                        </>
                      )}
                    </div>
                    {/* vibe tags */}
                    {prefs?.travelVibe?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {prefs.travelVibe.slice(0, 4).map((v: string) => (
                          <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-[#DA880F]/5 text-[#DA880F] font-medium capitalize">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                      disabled={deletingId === trip.id}
                      className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deletingId === trip.id ? (
                        <div className="w-4 h-4 border-2 border-neutral-200 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* expanded itinerary */}
              <AnimatePresence>
                {isExpanded && plan && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-neutral-100 pt-4">
                      {/* summary */}
                      {plan.summary && (
                        <p className="text-sm text-neutral-600 leading-relaxed mb-5">{plan.summary}</p>
                      )}

                      {/* day cards */}
                      {plan.itineraryTable?.map((day: any, dayIdx: number) => (
                        <div key={dayIdx} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DA880F]/90 to-[#DA880F] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              D{day.day}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-neutral-800">Day {day.day}</span>
                              {day.theme && <span className="text-xs text-[#DA880F] ml-2">· {day.theme}</span>}
                            </div>
                            {day.dailyCost && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {day.dailyCost}
                              </span>
                            )}
                          </div>

                          <div className="ml-11 space-y-2">
                            {day.rows?.map((act: any, ai: number) => (
                              <div key={ai} className="flex gap-3 p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                                <div className="w-6 h-6 rounded-md bg-white border border-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                                  {getActivityIcon(act.activity || "")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-neutral-400 font-medium">{act.time}</span>
                                    <span className="text-xs font-medium text-neutral-800">{act.activity}</span>
                                  </div>
                                  {act.description && <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{act.description}</p>}
                                  <div className="flex gap-3 mt-1">
                                    {act.distance && <span className="text-[9px] text-neutral-400 flex items-center gap-0.5"><ArrowRight className="w-2.5 h-2.5" />{act.distance}</span>}
                                    {act.pricing && <span className="text-[9px] text-[#DA880F] flex items-center gap-0.5"><IndianRupee className="w-2.5 h-2.5" />{act.pricing}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* meals & stay */}
                            {(day.meals || day.accommodation) && (
                              <div className="p-3 rounded-xl bg-neutral-50/60 border border-neutral-100 space-y-1 text-[11px] text-neutral-600">
                                {day.meals?.breakfast && <p>☕ <span className="font-medium">Breakfast:</span> {day.meals.breakfast}</p>}
                                {day.meals?.lunch && <p>🍛 <span className="font-medium">Lunch:</span> {day.meals.lunch}</p>}
                                {day.meals?.dinner && <p>🌙 <span className="font-medium">Dinner:</span> {day.meals.dinner}</p>}
                                {day.accommodation && <p>🏨 <span className="font-medium">Stay:</span> {day.accommodation}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* budget bar */}
                      {plan.budgetBreakdown && (
                        <div className="mt-5 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                          <p className="text-xs font-semibold text-neutral-700 mb-3">💰 Budget Breakdown</p>
                          {Object.entries(plan.budgetBreakdown).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-xs mb-1">
                              <span className="text-neutral-500 capitalize">{k}</span>
                              <span className="font-medium text-neutral-700">{v as string}</span>
                            </div>
                          ))}
                          {plan.totalEstimatedCost && (
                            <div className="flex justify-between text-xs mt-2 pt-2 border-t border-neutral-200 font-semibold">
                              <span className="text-neutral-700">Total</span>
                              <span className="text-[#DA880F]">{plan.totalEstimatedCost}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* local tips */}
                      {plan.localTips?.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                          <p className="text-xs font-semibold text-blue-800 mb-2">📌 Local Tips</p>
                          {plan.localTips.map((tip: string, i: number) => (
                            <p key={i} className="text-[11px] text-blue-700 mb-1">📍 {tip}</p>
                          ))}
                        </div>
                      )}

                      {/* saved date */}
                      <p className="text-[10px] text-neutral-400 mt-4 text-right">
                        Saved on {formatDate(trip.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

