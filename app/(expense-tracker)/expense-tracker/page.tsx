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
    createdUserId: string;
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

  async function handleDeleteTrip() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${selectedTrip?.tripId}`,
      { method: "DELETE" }
    );
  }
  return (
    <div>
      <Navbar />
      <TripDetails
        tripId={selectedTrip.tripId}
        createdUserId={selectedTrip?.createdUserId}
        tripName={selectedTrip.tripDestination}
        onBack={() => setSelectedTrip(null)}
        handleDeleteTrip={handleDeleteTrip}
      />
      <Footer />
    </div>
  );
}
