"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  IndianRupee,
  Utensils,
  Bed,
  Compass,
} from "lucide-react";

interface Activity {
  time: string;
  activity: string;
  description: string;
  distance: string;
  pricing: string;
}

interface DayData {
  day: number;
  theme: string;
  rows: Activity[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  accommodation: string;
  dailyCost: string;
}

interface ItineraryDayCardProps {
  data: DayData;
  index: number;
  isLast: boolean;
}

export default function ItineraryDayCard({
  data,
  index,
  isLast,
}: ItineraryDayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-[22px] top-0 bottom-0 flex flex-col items-center z-0">
        <div
          className={`w-px flex-1 ${isLast ? "bg-gradient-to-b from-neutral-200 to-transparent" : "bg-neutral-200"}`}
        />
      </div>

      <div className="relative flex gap-4">
        {/* Day badge */}
        <div className="relative z-10 flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[color:var(--color-brand-start)] to-[color:var(--color-brand)] flex items-center justify-center shadow-md shadow-[color:var(--color-brand)]/20">
            <span className="text-white text-xs font-bold">
              D{data.day}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 pb-6 min-w-0">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-neutral-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--color-navy)]">
                  Day {data.day}
                </h3>
                <p className="text-xs text-[color:var(--color-brand)] font-medium mt-0.5 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  {data.theme}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                {data.dailyCost}
              </span>
            </div>

            {/* Activities Timeline */}
            <div className="px-5 py-3">
              <div className="space-y-0">
                {data.rows?.map((activity, actIdx) => (
                  <div
                    key={actIdx}
                    className="flex gap-3 py-3 border-b border-neutral-50 last:border-0"
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 w-16">
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px] font-medium">
                          {activity.time}
                        </span>
                      </div>
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[color:var(--color-navy)] leading-snug">
                        {activity.activity}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {activity.distance && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
                            <MapPin className="w-2.5 h-2.5" />
                            {activity.distance}
                          </span>
                        )}
                        {activity.pricing && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--color-brand)] font-medium">
                            <IndianRupee className="w-2.5 h-2.5" />
                            {activity.pricing}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals & Stay Footer */}
            <div className="px-5 py-3 bg-neutral-50/60 border-t border-neutral-100">
              <div className="grid grid-cols-1 gap-2">
                {/* Meals */}
                {data.meals && (
                  <div className="flex items-start gap-2">
                    <Utensils className="w-3.5 h-3.5 text-[color:var(--color-brand)] mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-neutral-600 leading-relaxed space-y-0.5">
                      {data.meals.breakfast && (
                        <p>
                          <span className="font-medium text-neutral-700">
                            Breakfast:
                          </span>{" "}
                          {data.meals.breakfast}
                        </p>
                      )}
                      {data.meals.lunch && (
                        <p>
                          <span className="font-medium text-neutral-700">
                            Lunch:
                          </span>{" "}
                          {data.meals.lunch}
                        </p>
                      )}
                      {data.meals.dinner && (
                        <p>
                          <span className="font-medium text-neutral-700">
                            Dinner:
                          </span>{" "}
                          {data.meals.dinner}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Accommodation */}
                {data.accommodation && (
                  <div className="flex items-start gap-2">
                    <Bed className="w-3.5 h-3.5 text-[color:var(--color-brand)] mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      <span className="font-medium text-neutral-700">
                        Stay:
                      </span>{" "}
                      {data.accommodation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

