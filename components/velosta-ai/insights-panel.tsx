"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  TrendingDown,
  MapPin,
  Send,
  PieChart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { ItineraryPDFExport } from "./itinerary-pdf-export";

interface InsightsPanelProps {
  itinerary: any;
  tripData: any;
  onModify: (message: string) => void;
  isModifying: boolean;
}

export default function InsightsPanel({
  itinerary,
  tripData,
  onModify,
  isModifying,
}: InsightsPanelProps) {
  const [modifyInput, setModifyInput] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "budget"
  );

  const handleModify = () => {
    if (modifyInput.trim() && !isModifying) {
      onModify(modifyInput.trim());
      setModifyInput("");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (!itinerary) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-base font-semibold text-[color:var(--color-navy)]">
              Travel Insights
            </h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              AI insights will appear here after your trip plan is generated
            </p>
          </div>
        </div>
      </div>
    );
  }

  const budget = itinerary.budgetBreakdown;
  const expense = itinerary.expenseSummary;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-purple-500" />
          </div>
          <h2 className="text-base font-semibold text-[color:var(--color-navy)]">
            Travel Insights
          </h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
        {/* Budget Overview */}
        {budget && (
          <div className="rounded-xl border border-neutral-100 overflow-hidden">
            <button
              onClick={() => toggleSection("budget")}
              className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[color:var(--color-brand)]" />
                <span className="text-xs font-semibold text-[color:var(--color-navy)] uppercase tracking-wider">
                  Budget Breakdown
                </span>
              </div>
              {expandedSection === "budget" ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "budget" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-2.5">
                    {Object.entries(budget).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-600 capitalize">
                            {key}
                          </span>
                          <span className="text-xs font-semibold text-[color:var(--color-navy)]">
                            {value as string}
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-brand-start)] to-[color:var(--color-brand)]"
                            style={{
                              width: `${Math.min(100, 20 + Math.random() * 60)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {itinerary.totalBudget && (
                      <div className="pt-2 mt-2 border-t border-neutral-100 flex justify-between">
                        <span className="text-xs font-semibold text-neutral-700">
                          Total Budget
                        </span>
                        <span className="text-xs font-bold text-[color:var(--color-brand)]">
                          {itinerary.totalBudget}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Expense Summary */}
        {expense?.perPersonBreakdown && (
          <div className="rounded-xl border border-neutral-100 overflow-hidden">
            <button
              onClick={() => toggleSection("expense")}
              className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-[color:var(--color-navy)] uppercase tracking-wider">
                  Expense Details
                </span>
              </div>
              {expandedSection === "expense" ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "expense" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-3">
                    {Object.entries(expense.perPersonBreakdown).map(
                      ([category, data]: [string, any]) => (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-neutral-700 capitalize">
                              {category}
                            </span>
                            <span className="text-[11px] font-semibold text-[color:var(--color-brand)]">
                              {data.amount}
                            </span>
                          </div>
                          {data.details && (
                            <ul className="space-y-0.5">
                              {data.details.map(
                                (detail: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="text-[10px] text-neutral-500 pl-2 border-l border-neutral-200"
                                  >
                                    {detail}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )
                    )}
                    {expense.totalPerPerson && (
                      <div className="pt-2 border-t border-neutral-100 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[11px] text-neutral-600">
                            Per Person
                          </span>
                          <span className="text-[11px] font-bold text-[color:var(--color-navy)]">
                            {expense.totalPerPerson}
                          </span>
                        </div>
                        {expense.totalForGroup && (
                          <div className="flex justify-between">
                            <span className="text-[11px] text-neutral-600">
                              Group Total
                            </span>
                            <span className="text-[11px] font-bold text-[color:var(--color-brand)]">
                              {expense.totalForGroup}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Cost Saving Tips */}
        {expense?.costSavingTips && expense.costSavingTips.length > 0 && (
          <div className="rounded-xl border border-neutral-100 overflow-hidden">
            <button
              onClick={() => toggleSection("tips")}
              className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-[color:var(--color-navy)] uppercase tracking-wider">
                  Saving Tips
                </span>
              </div>
              {expandedSection === "tips" ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "tips" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-2">
                    {expense.costSavingTips.map(
                      (tip: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[11px] text-neutral-600"
                        >
                          <span className="text-green-500 mt-px">💡</span>
                          <span>{tip}</span>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Local Tips */}
        {itinerary.localTips && itinerary.localTips.length > 0 && (
          <div className="rounded-xl border border-neutral-100 overflow-hidden">
            <button
              onClick={() => toggleSection("local")}
              className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[color:var(--color-brand)]" />
                <span className="text-xs font-semibold text-[color:var(--color-navy)] uppercase tracking-wider">
                  Local Tips
                </span>
              </div>
              {expandedSection === "local" ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "local" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-2">
                    {itinerary.localTips.map((tip: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[11px] text-neutral-600"
                      >
                        <span className="text-[color:var(--color-brand)] mt-px">
                          📌
                        </span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PDF Export */}
        <ItineraryPDFExport itineraryData={itinerary} tripData={tripData} />
      </div>

      {/* Modify Trip Input */}
      <div className="px-4 py-3 border-t border-neutral-100">
        <div className="flex items-center gap-1 mb-2">
          <MessageSquare className="w-3 h-3 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">
            Modify your trip
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Add a museum on day 2..."
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleModify()}
            disabled={isModifying}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]/10 outline-none transition-all placeholder:text-neutral-400 disabled:opacity-50"
          />
          <button
            onClick={handleModify}
            disabled={!modifyInput.trim() || isModifying}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
            style={{
              background:
                "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
            }}
          >
            {isModifying ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


