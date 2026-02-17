"use client";

import { Check } from "lucide-react";

interface Step {
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number; // 1-indexed
}

export default function StepIndicator({
    steps,
    currentStep,
}: StepIndicatorProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <div key={stepNumber} className="flex items-center flex-1 last:flex-initial">
                            {/* Step circle + label */}
                            <div className="flex flex-col items-center gap-1.5 relative">
                                {/* Circle */}
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-500 ease-out
                    ${isCompleted
                                            ? "scale-100 shadow-md"
                                            : isActive
                                                ? "scale-110 shadow-lg ring-4 ring-opacity-20"
                                                : "scale-100"
                                        }
                  `}
                                    style={{
                                        background: isCompleted
                                            ? "linear-gradient(135deg, var(--color-brand-start), var(--color-brand))"
                                            : isActive
                                                ? "linear-gradient(135deg, var(--color-brand-start), var(--color-brand))"
                                                : "#e5e7eb",
                                        color: isCompleted || isActive ? "white" : "#9ca3af",
                                        boxShadow: isActive
                                            ? "0 0 0 4px color-mix(in srgb, var(--color-brand) 20%, transparent), 0 4px 12px rgba(0,0,0,0.1)"
                                            : isCompleted
                                                ? "0 2px 8px rgba(0,0,0,0.1)"
                                                : "none",
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5 animate-[scaleIn_0.3s_ease-out]" />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                    text-xs font-semibold tracking-wide whitespace-nowrap
                    transition-all duration-500
                    ${isCompleted
                                            ? "text-[color:var(--color-navy)]"
                                            : isActive
                                                ? "text-[color:var(--color-navy)]"
                                                : "text-gray-400"
                                        }
                  `}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line (not after last step) */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[3px] mx-4 rounded-full bg-gray-200 overflow-hidden relative self-start mt-5">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: isCompleted ? "100%" : "0%",
                                            background:
                                                "linear-gradient(90deg, var(--color-brand-start), var(--color-brand))",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
