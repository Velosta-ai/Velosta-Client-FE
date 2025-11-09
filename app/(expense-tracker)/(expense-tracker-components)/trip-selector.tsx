"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <Button
          variant="outline"
          className="gap-2 h-10 rounded-lg hover:bg-secondary/50 bg-transparent"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">{selectedTrip}</span>
          <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {trips.map((trip) => (
          <DropdownMenuItem key={trip} onClick={() => onSelectTrip(trip)}>
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {trip}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
