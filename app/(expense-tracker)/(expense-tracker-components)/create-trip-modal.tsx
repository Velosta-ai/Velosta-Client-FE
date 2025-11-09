"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarIcon, PlaneTakeoff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInDays } from "date-fns";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: any) => void;
  userId?: string;
}

export default function CreateTripModal({
  isOpen,
  onClose,
  onTripCreated,
  userId,
}: CreateTripModalProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [loading, setLoading] = useState(false);

  // --- Handle trip creation ---
  const handleCreateTrip = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            preferences: {},
            plan: {},
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create trip");
      const newTrip = await res.json();

      onTripCreated(newTrip);
      toast({
        title: "Trip created 🎉",
        description: `${formData.destination} added successfully.`,
      });
      handleClose();
    } catch (err: any) {
      toast({
        title: "Error creating trip",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ destination: "", startDate: null, endDate: null });
    onClose();
  };

  // --- Date range logic (FIXED) ---
  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    setFormData({
      ...formData,
      startDate: range.from || null,
      endDate: range.to || null,
    });
  };

  const { startDate, endDate } = formData;
  const days =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-xl border-border p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Add your destination and travel dates to begin planning.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Tokyo, Japan"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              className="h-9 rounded-lg border-border"
            />
          </div>

          {/* Date Range Picker (FIXED) */}
          <div className="space-y-2">
            <Label>Travel Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`
                    w-full justify-start text-left font-normal rounded-lg h-9
                    ${!startDate ? "text-muted-foreground" : ""}
                  `}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate
                    ? `${format(startDate, "PPP")} → ${format(endDate, "PPP")}`
                    : startDate
                    ? `${format(startDate, "PPP")} → Select end`
                    : "Pick travel dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate ?? undefined,
                    to: endDate ?? undefined,
                  }}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Display summary */}
            {startDate && endDate && (
              <p className="text-xs text-muted-foreground mt-1">
                ✈️ Trip duration: <span className="font-medium">{days}</span>{" "}
                {days === 1 ? "day" : "days"}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-lg h-9 border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTrip}
              disabled={loading}
              className="flex-1 rounded-lg h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlaneTakeoff className="w-4 h-4 mr-1" />
                  Create Trip
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
