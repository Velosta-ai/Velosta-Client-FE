"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, ChevronRight, RefreshCcw, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import CreateTripModal from "../(expense-tracker-components)/create-trip-modal";
import { useUser } from "@/app/utils/context";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  members?: { id: string }[];
  expenses?: { amount: number }[];
}

interface TripsListProps {
  onSelectTrip: (tripId: string, tripName: string) => void;
}

export default function TripsList({ onSelectTrip }: TripsListProps) {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_URL
          }/api/expense-tracker/trips?cacheBust=${Date.now()}&userId=${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch trips.");
        const data = await res.json();
        setTrips(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Failed to load trips",
          description: "Please check your connection or try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user?.id, retryKey]);

  const handleRetry = () => setRetryKey((k) => k + 1);

  const handleTripCreated = (newTrip: Trip) => {
    setTrips((prev) => [...prev, newTrip]);
    toast({
      title: "Trip created 🎉",
      description: `${newTrip.destination} has been added to your trips.`,
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center pt-20 relative transition-all">
      <main className="max-w-2xl w-full mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-semibold text-gray-900">Your Trips</h1>
          <p className="text-sm text-gray-500 mt-2">
            Select or create a trip to view and manage expenses
          </p>
        </motion.div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium mb-3">
              {error || "Something went wrong"}
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2 mx-auto border-brand-accent text-brand-accent hover:bg-brand-surface"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trips.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-brand-surface/60 shadow-sm transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/10 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <MapPin className="w-8 h-8 text-brand-accent" />
            </motion.div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No trips yet
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-sm">
              You haven’t created any trips yet. Start by adding one to track
              your expenses and memories!
            </p>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-brand-accent text-white rounded-xl shadow hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-1" />
              Create Trip
            </Button>
          </motion.div>
        )}

        {/* Trip Cards */}
        <AnimatePresence>
          {!loading && !error && trips.length > 0 && (
            <motion.div
              layout
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {trips.map((trip) => {
                const start = new Date(trip.startDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                );
                const end = new Date(trip.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const total =
                  trip.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
                const membersCount = trip.members?.length || 0;

                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card
                      onClick={() =>
                        onSelectTrip({
                          tripId: trip.id,
                          tripDestination: trip.destination,
                          createdUserId: trip?.userId,
                        })
                      }
                      className="p-4 bg-brand-surface border border-brand-surface/70 hover:bg-brand-surface/90 transition-all cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-brand-accent/10 rounded-lg group-hover:bg-brand-accent/20 transition-colors">
                            <MapPin className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {trip.destination}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {start} – {end}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              ₹{total.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {membersCount} members
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 rounded-full bg-brand-accent text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all relative"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-brand-accent/40 blur-lg"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Plus className="w-5 h-5 relative z-10" />
        </Button>
      </motion.div>

      {/* Modal */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTripCreated={handleTripCreated}
        userId={user?.id}
      />
    </div>
  );
}
