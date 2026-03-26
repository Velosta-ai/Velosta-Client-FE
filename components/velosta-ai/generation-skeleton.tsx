"use client";

import React from "react";
import { motion } from "framer-motion";

interface GenerationSkeletonProps {
  phase: "analyzing" | "destination" | "itinerary" | "insights";
  progress: number; // 0-100
}

const phaseMessages: Record<string, { title: string; description: string }> = {
  analyzing: {
    title: "Analyzing your preferences",
    description: "Understanding your travel style and requirements...",
  },
  destination: {
    title: "Crafting your destination",
    description: "Finding the perfect experiences for you...",
  },
  itinerary: {
    title: "Building your itinerary",
    description: "Planning activities, meals, and accommodations...",
  },
  insights: {
    title: "Generating travel insights",
    description: "Calculating budgets and local recommendations...",
  },
};

export default function GenerationSkeleton({
  phase,
  progress,
}: GenerationSkeletonProps) {
  const message = phaseMessages[phase];

  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              className="stroke-neutral-100"
              strokeWidth="2"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              className="stroke-[color:var(--color-brand)]"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="226"
              initial={{ strokeDashoffset: 226 }}
              animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-[color:var(--color-navy)]"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Phase Message */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-[color:var(--color-navy)] mb-1">
            {message.title}
          </h3>
          <p className="text-sm text-neutral-500">{message.description}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-brand-start)] to-[color:var(--color-brand)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-wider">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Skeleton Cards Preview */}
        <div className="mt-10 space-y-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: progress > i * 30 ? 0.6 : 0.2, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-neutral-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-2 bg-neutral-50 rounded-full w-1/2 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

