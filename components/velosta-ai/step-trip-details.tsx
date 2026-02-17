"use client";

import { useState, useMemo } from "react";
import {
    MapPin,
    CalendarDays,
    Locate,
    ArrowRight,
    Mountain,
    Landmark,
    Palmtree,
    Utensils,
    User,
    Heart,
    Users,
    PartyPopper,
    Sparkles,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import StepIndicator from "./step-indicator";

interface StepTripDetailsProps {
    onBack: () => void;
    onNext: (data: TripDetailsData) => void;
    choice: "known" | "surprise";
}

export interface TripDetailsData {
    startingFrom: string;
    dates: { from: Date | undefined; to: Date | undefined };
    budget: number;
    travellingWith: string;
    interests: string[];
}

const TRAVELLING_WITH = [
    { id: "solo", label: "Solo", icon: User },
    { id: "couple", label: "Couple", icon: Heart },
    { id: "family", label: "Family", icon: Users },
    { id: "friends", label: "Friends", icon: Users },
];

const INTERESTS = [
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "foodie", label: "Foodie", icon: Utensils },
    { id: "relaxation", label: "Relaxation", icon: Palmtree },
    { id: "cultural", label: "Cultural", icon: Landmark },
    { id: "party", label: "Party", icon: PartyPopper },
    { id: "spiritual", label: "Spiritual", icon: Sparkles },
];

const STEPS = [
    { label: "Destination" },
    { label: "Trip Details" },
    { label: "Preferences" },
    { label: "Generate" },
];

function formatBudget(val: number): string {
    if (val >= 100000)
        return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
}

export default function StepTripDetails({
    onBack,
    onNext,
    choice,
}: StepTripDetailsProps) {
    const [startingFrom, setStartingFrom] = useState("");
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({ from: undefined, to: undefined });
    const [showCalendar, setShowCalendar] = useState(false);
    const [budget, setBudget] = useState([30000]);
    const [travellingWith, setTravellingWith] = useState("solo");
    const [interests, setInterests] = useState<string[]>(["adventure"]);

    const toggleInterest = (id: string) => {
        setInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const dateLabel = useMemo(() => {
        if (dateRange.from && dateRange.to) {
            const f = dateRange.from.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            });
            const t = dateRange.to.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            });
            return `${f} – ${t}`;
        }
        if (dateRange.from) {
            return dateRange.from.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            });
        }
        return "Select dates";
    }, [dateRange]);

    const handleNext = () => {
        onNext({
            startingFrom,
            dates: dateRange,
            budget: budget[0],
            travellingWith,
            interests,
        });
    };

    return (
        <div className="w-full flex flex-col items-center px-4 pb-16 mt-6">
            {/* Step indicator */}
            <StepIndicator steps={STEPS} currentStep={2} />

            {/* Main card */}
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
                {/* Heading */}
                <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-navy)] text-center mb-2">
                    Where does your journey begin?
                </h1>
                <p className="text-gray-500 text-center text-sm mb-8">
                    Tell us a bit about your trip so our AI can optimize your budget and
                    route.
                </p>

                {/* Starting From + Dates row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {/* Starting From */}
                    <div>
                        <label className="text-sm font-semibold text-[color:var(--color-navy)] mb-2 block">
                            Starting From
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={startingFrom}
                                onChange={(e) => setStartingFrom(e.target.value)}
                                placeholder="e.g., Mumbai, Delhi..."
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[color:var(--color-navy)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                style={
                                    {
                                        "--tw-ring-color": "color-mix(in srgb, var(--color-brand) 30%, transparent)",
                                    } as React.CSSProperties
                                }
                            />
                            <Locate
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-colors"
                                style={{ color: "var(--color-brand)" }}
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="relative">
                        <label className="text-sm font-semibold text-[color:var(--color-navy)] mb-2 block">
                            Dates
                        </label>
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-left hover:border-gray-300 transition-all cursor-pointer"
                        >
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            <span
                                className={
                                    dateRange.from
                                        ? "text-[color:var(--color-navy)]"
                                        : "text-gray-400"
                                }
                            >
                                {dateLabel}
                            </span>
                            <div
                                className="ml-auto w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: "var(--color-brand)" }}
                            />
                        </button>

                        {/* Calendar dropdown */}
                        {showCalendar && (
                            <div className="absolute z-50 top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={(range: any) => {
                                        setDateRange(range || { from: undefined, to: undefined });
                                        if (range?.to) setShowCalendar(false);
                                    }}
                                    className="[--cell-size:36px]"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget */}
                <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-[color:var(--color-navy)]">
                                Total Budget (INR)
                            </h3>
                            <p className="text-xs text-gray-400">Excluding flights</p>
                        </div>
                        <span
                            className="text-lg font-bold"
                            style={{ color: "var(--color-brand)" }}
                        >
                            {formatBudget(budget[0])}
                        </span>
                    </div>
                    <div className="px-1">
                        <Slider
                            value={budget}
                            onValueChange={setBudget}
                            min={10000}
                            max={200000}
                            step={5000}
                            className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:shadow-md"
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>₹10K</span>
                        <span>₹1L</span>
                        <span>₹2L</span>
                    </div>
                </div>

                {/* Travel Style + Interests row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Travelling With */}
                    <div>
                        <h3 className="text-sm font-semibold text-[color:var(--color-navy)] mb-3">
                            Travelling With
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {TRAVELLING_WITH.map((option) => {
                                const isActive = travellingWith === option.id;
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setTravellingWith(option.id)}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${isActive
                                            ? "bg-white shadow-md"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                            }`}
                                        style={
                                            isActive
                                                ? { borderColor: "var(--color-brand)" }
                                                : undefined
                                        }
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{
                                                backgroundColor: isActive
                                                    ? "color-mix(in srgb, var(--color-brand) 12%, transparent)"
                                                    : "#f3f4f6",
                                            }}
                                        >
                                            <Icon
                                                className="w-4 h-4"
                                                style={{
                                                    color: isActive
                                                        ? "var(--color-brand)"
                                                        : "#6b7280",
                                                }}
                                            />
                                        </div>
                                        <span className={`text-sm font-semibold ${isActive ? "text-[color:var(--color-navy)]" : "text-gray-600"
                                            }`}>
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <h3 className="text-sm font-semibold text-[color:var(--color-navy)] mb-3">
                            Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {INTERESTS.map((interest) => {
                                const isActive = interests.includes(interest.id);
                                const Icon = interest.icon;
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                            ? "text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        style={
                                            isActive
                                                ? {
                                                    background:
                                                        "linear-gradient(135deg, var(--color-brand-start), var(--color-brand))",
                                                }
                                                : undefined
                                        }
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {interest.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                        onClick={onBack}
                        className="text-sm font-medium text-gray-500 hover:text-[color:var(--color-navy)] transition-colors cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-[color:var(--color-brand-contrast)] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        style={{
                            background:
                                "linear-gradient(135deg, var(--color-brand-start), var(--color-brand))",
                        }}
                    >
                        Next: Select Preferences
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Footer tagline */}
        </div>
    );
}
