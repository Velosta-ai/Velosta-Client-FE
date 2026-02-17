"use client";

import { useState } from "react";
import StepDestination from "./step-destination";
import StepTripDetails from "./step-trip-details";
import type { TripDetailsData } from "./step-trip-details";

export default function VelostaBotInterface() {
  const [step, setStep] = useState(1);
  const [destinationChoice, setDestinationChoice] = useState<"known" | "surprise">("known");

  const handleDestinationSelect = (choice: "known" | "surprise") => {
    setDestinationChoice(choice);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleTripDetailsNext = (data: TripDetailsData) => {
    // For now, log the data — future steps will use this
    console.log("Trip details:", data);
    // Future: setStep(3) for preferences
  };

  return (
    <>
      {step === 1 && <StepDestination onSelect={handleDestinationSelect} />}
      {step === 2 && (
        <StepTripDetails
          onBack={handleBack}
          onNext={handleTripDetailsNext}
          choice={destinationChoice}
        />
      )}
    </>
  );
}
