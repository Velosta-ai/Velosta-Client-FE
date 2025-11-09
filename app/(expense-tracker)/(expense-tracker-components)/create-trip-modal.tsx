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
import { format } from "date-fns";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: any) => void;
  userId?: string; // optional if you add auth context
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
            plan: {}, // ✅ matches updated Prisma schema
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create trip.");
      const newTrip = await res.json();
      onTripCreated(newTrip);

      toast({
        title: "Trip created 🎉",
        description: `${formData.destination} has been added successfully.`,
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
    setFormData({
      destination: "",
      startDate: null,
      endDate: null,
    });
    onClose();
  };
  console.log(userId, "hola");
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

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal rounded-lg h-9 ${
                      !formData.startDate ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ?? undefined}
                    onSelect={(date) =>
                      setFormData({ ...formData, startDate: date ?? null })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal rounded-lg h-9 ${
                      !formData.endDate ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? format(formData.endDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate ?? undefined}
                    onSelect={(date) =>
                      setFormData({ ...formData, endDate: date ?? null })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
