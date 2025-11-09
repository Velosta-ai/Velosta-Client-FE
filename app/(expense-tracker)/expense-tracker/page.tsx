"use client";

import { useState } from "react";
import TripsList from "../(expense-tracker-components)/trip-list";
import TripDetails from "../(expense-tracker-components)/trip-details";
import "../../../app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  const [selectedTrip, setSelectedTrip] = useState<{
    tripId: string;
    tripDestination: string;
  } | null>(null);

  if (!selectedTrip) {
    return (
      <div>
        <Navbar />
        <TripsList onSelectTrip={setSelectedTrip} />
        <Footer />
      </div>
    );
  }

  console.log(selectedTrip, "selected");

  return (
    <div>
      <Navbar />
      <TripDetails
        tripId={selectedTrip.tripId}
        tripName={selectedTrip.tripDestination}
        onBack={() => setSelectedTrip(null)}
      />
      <Footer />
    </div>
  );
}
