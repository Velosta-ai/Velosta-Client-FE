"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface TripSelectorProps {
  selectedTrip: string;
  onSelectTrip: (trip: string) => void;
}

const trips = ["Paris 2025", "Tokyo Adventure", "NYC Week", "Bali Getaway"];

export default function TripSelector({
  selectedTrip,
  onSelectTrip,
}: TripSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            className="
              gap-2 h-10 rounded-xl border-[#FFE5D1]
              bg-[#FFF9ED] text-gray-800 font-medium shadow-sm
              hover:bg-[#FFE5D1]/50 hover:shadow-md
              transition-all duration-200
            "
          >
            <MapPin className="w-4 h-4 text-[#FF792A]" />
            <span>{selectedTrip}</span>
            <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="
          w-48 border border-[#FFE5D1] bg-[#FFF9ED]/95 backdrop-blur-sm
          rounded-xl shadow-md p-1
        "
      >
        {trips.map((trip) => (
          <DropdownMenuItem
            key={trip}
            onClick={() => onSelectTrip(trip)}
            className="
              flex items-center gap-2 rounded-md px-3 py-2
              text-sm text-gray-800 hover:bg-[#FFE5D1]/60
              transition-colors
            "
          >
            <MapPin className="w-4 h-4 text-[#FF792A]" />
            <span>{trip}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
