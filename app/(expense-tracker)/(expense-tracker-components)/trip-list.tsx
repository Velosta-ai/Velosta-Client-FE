"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, ChevronRight, RefreshCcw, Plus } from "lucide-react";
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
  const { user, setUser, setAccessToken, accessToken } = useUser();
  console.log(user?.id, "erii");
  useEffect(() => {
    if (!user?.id) return;

    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(user?.id, "fetching trips for user");

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
    <div className="min-h-screen bg-background mt-20 flex flex-col items-center relative">
      <main className="max-w-2xl w-full mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Your Trips
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Select or create a trip to view and manage expenses
          </p>
        </motion.div>

        {/* Loader Skeleton */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-muted/30 rounded-xl border border-border"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-destructive font-medium mb-3">
              {error || "Something went wrong"}
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2 mx-auto"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trips.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-foreground font-medium">No trips yet</h3>
            <p className="text-sm text-muted-foreground">
              Create a trip to start tracking expenses!
            </p>
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
              transition={{ duration: 0.3 }}
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
                        })
                      }
                      className="p-4 border-border hover:bg-secondary/40 transition-all cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {trip.destination}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {start} – {end}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              ₹{total.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {membersCount} members
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
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

      {/* Floating Create Trip Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all relative"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/40 blur-lg"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Plus className="w-5 h-5 relative z-10" />
        </Button>
      </motion.div>

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTripCreated={handleTripCreated}
        userId={user?.id}
      />
    </div>
  );
}
