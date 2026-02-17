"use client";

import { MapPin, Sparkles } from "lucide-react";
import StepIndicator from "./step-indicator";

type DestinationChoice = "known" | "surprise";

interface StepDestinationProps {
    onSelect: (choice: DestinationChoice) => void;
}

const STEPS = [
    { label: "Destination" },
    { label: "Trip Details" },
    { label: "Preferences" },
    { label: "Generate" },
];

export default function StepDestination({ onSelect }: StepDestinationProps) {
    return (
        <div className="w-full flex flex-col items-center px-4 pb-16 mt-6">
            {/* Step indicator */}
            <StepIndicator steps={STEPS} currentStep={1} />

            {/* Main card */}
            <div className="w-full max-w-lg">

                {/* Heading */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-navy)] text-center mb-2">
                        Where to next?
                    </h1>
                    <p className="text-gray-500 text-center text-sm mb-8">
                        Start your journey by choosing how you want to plan.
                    </p>

                    {/* Option Cards */}
                    <div className="flex flex-col gap-4">
                        {/* I know my destination */}
                        <button
                            onClick={() => onSelect("known")}
                            className="group w-full text-left bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:border-[color:var(--color-brand)]/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[color:var(--color-brand)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[color:var(--color-brand)]/20 transition-colors duration-200">
                                    <MapPin className="w-5 h-5 text-[color:var(--color-brand)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-1">
                                        I know my destination
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Build a custom itinerary for a specific place you have in
                                        mind.
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Surprise me */}
                        <button
                            onClick={() => onSelect("surprise")}
                            className="group w-full text-left bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:border-[#a78bfa]/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e9d5ff] transition-colors duration-200">
                                    <Sparkles className="w-5 h-5 text-[#a78bfa]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-1">
                                        Surprise me
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Let our AI find the perfect hidden gems based on your
                                        budget.
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
        </div>
    );
}
