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
      <DialogContent className="max-w-md rounded-2xl border border-[#FFE5D1] bg-[#FFF9ED] shadow-lg">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create New Trip
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Add your destination and travel dates to begin planning.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-5 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-gray-700 text-sm">
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Tokyo, Japan"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              className="h-10 rounded-lg border-[#FFE5D1] focus:ring-2 focus:ring-[#FF792A]/50 bg-white"
            />
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm">Travel Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal rounded-lg h-10 border-[#FFE5D1] ${
                    !startDate ? "text-gray-500" : "text-gray-800"
                  } bg-white`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#FF792A]" />
                  {startDate && endDate
                    ? `${format(startDate, "PPP")} → ${format(endDate, "PPP")}`
                    : startDate
                    ? `${format(startDate, "PPP")} → Select end`
                    : "Pick travel dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-[#FFE5D1]"
                align="start"
              >
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

            {startDate && endDate && (
              <p className="text-xs text-gray-600 mt-1">
                ✈️ Trip duration:{" "}
                <span className="font-medium text-gray-800">{days}</span>{" "}
                {days === 1 ? "day" : "days"}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-10 rounded-lg border-[#FFE5D1] hover:bg-[#FFE5D1]/40 text-gray-700"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateTrip}
              disabled={loading}
              className="flex-1 h-10 rounded-lg bg-[#FF792A] text-white hover:shadow-md hover:bg-[#FF792A]/90 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <PlaneTakeoff className="w-4 h-4 mr-1 text-white" />
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
