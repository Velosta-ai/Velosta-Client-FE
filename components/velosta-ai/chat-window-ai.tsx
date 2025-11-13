"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/utils/context";
import { DateRangePicker } from "../../components/travel-planner/date-range-picker";
import { TravelTypeSelector } from "../../components/travel-planner/travel-type-selector";
import { TravelerCounter } from "../../components/travel-planner/traveler-counter";
import { TravelVibeSelector } from "../../components/travel-planner/travel-vibe-selector";
import { MustVisitInput } from "../../components/travel-planner/must-visit-input";
import { PreferencesSection } from "../../components/travel-planner/preferences-section";
import { ItineraryPDFExport } from "./itinerary-pdf-export";
import {
  Download,
  Info,
  Clock,
  Map,
  Utensils,
  Home,
  TrendingUp,
  AlertCircle,
  MapPin,
  Send,
  IndianRupee,
} from "lucide-react";

const colors = {
  primary: "#FF7729",
  primaryHover: "#E56A1F",
  primaryLight: "#FFF5F0",
  primaryDark: "#D45A1A",
  secondary: "#F9F7F4",
  secondaryHover: "#F0EDEA",
  card: "#FFFFFF",
  border: "#E8E3DE",
  text: "#1F2937",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  accent: "#10B981",
  accentLight: "#ECFDF5",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface TripData {
  destination?: string;
  travelType?: string;
  dateRange?: { start: string; end: string };
  travelers?: { adults: number; children: number };
  budget?: string;
  travelVibe?: string[];
  mustVisitPlaces?: string[];
  preferences?: Record<string, string[]>;
  accommodation?: string;
  specialRequests?: string;
}

export function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<"guided" | "free">("guided");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [tripData, setTripData] = useState<TripData>({});
  const [currentItinerary, setCurrentItinerary] = useState<any>(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const listRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useUser();

  const questions = [
    { key: "destination", text: "Where would you like to go?" },
    { key: "travelType", text: "Who's traveling with you?", type: "selector" },
    {
      key: "dateRange",
      text: "When are you planning to travel?",
      type: "calendar",
    },
    { key: "travelers", text: "How many travelers?", type: "counter" },
    { key: "budget", text: "What's your expected budget for the trip?" },
    { key: "travelVibe", text: "What's your travel vibe?", type: "vibe" },
    {
      key: "mustVisitPlaces",
      text: "Are there any must-visit places on your list?",
      type: "places",
    },
    {
      key: "preferences",
      text: "Let's set your preferences",
      type: "preferences",
    },
  ];

  // Auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Initialize greeting
  useEffect(() => {
    if (user?.name && messages.length === 0) {
      setMessages([
        {
          id: "assistant-start",
          role: "assistant",
          content: `Hey ${user.name}! I'm Velosta AI, your travel companion!\n${questions[0].text}`,
        },
      ]);
    }
  }, [user?.name]);

  function safeParseJSON(str: string) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  function isProbablyJson(str: string) {
    const trimmed = str.trim();
    return (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    );
  }

  // Submit message
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setConversationHistory((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    if (phase === "guided") {
      const current = questions[questionIndex];
      const updatedTripData = { ...tripData, [current.key]: text };
      setTripData(updatedTripData);

      if (questionIndex < questions.length - 1) {
        const next = questions[questionIndex + 1];
        setQuestionIndex((i) => i + 1);
        setTimeout(() => {
          const assistantMsg = next.text;
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: assistantMsg,
            },
          ]);
          setConversationHistory((prev) => [
            ...prev,
            { role: "assistant", content: assistantMsg },
          ]);
          setIsLoading(false);
        });
      } else {
        const generatingMsg =
          "Perfect! ✨ Generating your personalized itinerary...";
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: generatingMsg,
          },
        ]);
        setConversationHistory((prev) => [
          ...prev,
          { role: "assistant", content: generatingMsg },
        ]);
        await generateItinerary(updatedTripData);
        setPhase("free");
        setIsLoading(false);
      }
      return;
    }

    // Free-form chat
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/velosta-ai/ai-planner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userSaid: text,
            context: tripData,
            currentItinerary: currentItinerary,
            conversationHistory: conversationHistory,
            isModificationRequest: true,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process message");

      if (data.isTextResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.message,
          },
        ]);
        setConversationHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        if (data.itineraryTable) {
          setCurrentItinerary(data);
        }

        const assistantResponse = JSON.stringify(data, null, 2);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: assistantResponse,
          },
        ]);
        setConversationHistory((prev) => [
          ...prev,
          { role: "assistant", content: assistantResponse },
        ]);

        if (data.modificationsApplied && data.modificationsApplied.length > 0) {
          setTimeout(() => {
            const modsMsg = `Applied changes:\n${data.modificationsApplied
              .map((m: string) => `• ${m}`)
              .join("\n")}`;
            setMessages((prev) => [
              ...prev,
              {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: modsMsg,
              },
            ]);
          }, 500);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = "Something went wrong. Try again later.";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: errorMsg,
        },
      ]);
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateItinerary(finalData: TripData) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/velosta-ai/ai-planner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...finalData,
            conversationHistory: conversationHistory,
            isInitialGeneration: true,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to generate itinerary");

      setCurrentItinerary(data);

      const itineraryResponse = JSON.stringify(data, null, 2);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: itineraryResponse,
        },
      ]);
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: itineraryResponse },
      ]);
    } catch (err) {
      console.error("Itinerary error:", err);
      const errorMsg = "Failed to generate itinerary. Please retry.";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: errorMsg,
        },
      ]);
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    }
  }

  // === RENDER QUESTION COMPONENTS ===
  function renderQuestionComponent() {
    const current = questions[questionIndex];
    if (!current || phase !== "guided") return null;

    const nextStep = () => {
      if (questionIndex < questions.length - 1) {
        const next = questions[questionIndex + 1];
        setQuestionIndex((i) => i + 1);
        const assistantMsg = next.text;
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: assistantMsg,
          },
        ]);
        setConversationHistory((prev) => [
          ...prev,
          { role: "assistant", content: assistantMsg },
        ]);
      }
    };

    switch (current.type) {
      case "selector":
        return (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 border shadow-sm"
          >
            <TravelTypeSelector
              onSelect={(type) => {
                const updatedData = { ...tripData, travelType: type };
                setTripData(updatedData);
                setMessages((prev) => [
                  ...prev,
                  { id: `user-${Date.now()}`, role: "user", content: type },
                ]);
                setConversationHistory((prev) => [
                  ...prev,
                  { role: "user", content: type },
                ]);

                if (type.toLowerCase() === "solo") {
                  setTripData((prev) => ({
                    ...prev,
                    travelType: type,
                    travelers: { adults: 1, children: 0 },
                  }));

                  const nextQuestionIndex = questionIndex + 2;
                  if (nextQuestionIndex < questions.length) {
                    const next = questions[nextQuestionIndex];
                    setQuestionIndex(nextQuestionIndex);
                    const assistantMsg = next.text;
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `assistant-${Date.now()}`,
                        role: "assistant",
                        content: assistantMsg,
                      },
                    ]);
                    setConversationHistory((prev) => [
                      ...prev,
                      { role: "assistant", content: assistantMsg },
                    ]);
                  }
                } else {
                  nextStep();
                }
              }}
            />
          </div>
        );

      case "calendar":
        return (
          <div className="flex justify-center">
            <DateRangePicker
              onSelect={(start, end) => {
                const updatedData = { ...tripData, dateRange: { start, end } };
                setTripData(updatedData);
                const content = `${start} to ${end}`;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `user-${Date.now()}`,
                    role: "user",
                    content,
                  },
                ]);
                setConversationHistory((prev) => [
                  ...prev,
                  { role: "user", content },
                ]);
                nextStep();
              }}
              onClose={() => {}}
            />
          </div>
        );

      case "counter":
        return (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 border shadow-sm"
          >
            <TravelerCounter
              onUpdate={(adults, children) =>
                setTripData((prev) => ({
                  ...prev,
                  travelers: { adults, children },
                }))
              }
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const { adults = 1, children = 0 } = tripData.travelers || {};
                  const content = `${adults} adult${
                    adults > 1 ? "s" : ""
                  }, ${children} child${children !== 1 ? "ren" : ""}`;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `user-${Date.now()}`,
                      role: "user",
                      content,
                    },
                  ]);
                  setConversationHistory((prev) => [
                    ...prev,
                    { role: "user", content },
                  ]);
                  nextStep();
                }}
                style={{ backgroundColor: colors.primary, color: "white" }}
                className="mt-4 hover:opacity-90 text-primary-foreground font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "vibe":
        return (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 border shadow-sm"
          >
            <TravelVibeSelector
              onSelect={(vibes) =>
                setTripData((prev) => ({ ...prev, travelVibe: vibes }))
              }
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const content =
                    tripData.travelVibe && tripData.travelVibe.length > 0
                      ? tripData.travelVibe.join(", ")
                      : "Not specified";
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `user-${Date.now()}`,
                      role: "user",
                      content,
                    },
                  ]);
                  setConversationHistory((prev) => [
                    ...prev,
                    { role: "user", content },
                  ]);
                  nextStep();
                }}
                style={{ backgroundColor: colors.primary, color: "white" }}
                className="mt-4 hover:opacity-90 font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "places":
        return (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 border shadow-sm"
          >
            <MustVisitInput
              onUpdate={(places) =>
                setTripData((prev) => ({ ...prev, mustVisitPlaces: places }))
              }
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const content =
                    tripData.mustVisitPlaces &&
                    tripData.mustVisitPlaces.length > 0
                      ? tripData.mustVisitPlaces.join(", ")
                      : "No specific places";
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `user-${Date.now()}`,
                      role: "user",
                      content,
                    },
                  ]);
                  setConversationHistory((prev) => [
                    ...prev,
                    { role: "user", content },
                  ]);
                  nextStep();
                }}
                style={{ backgroundColor: colors.primary, color: "white" }}
                className="mt-4 hover:opacity-90 font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 border shadow-sm"
          >
            <PreferencesSection
              onUpdate={(prefs) =>
                setTripData((prev) => ({ ...prev, preferences: prefs }))
              }
            />
            <div className="flex justify-center">
              <Button
                onClick={async () => {
                  const content = "Preferences set";
                  const generatingMsg =
                    "Perfect! ✨ Generating your personalized itinerary...";
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `user-${Date.now()}`,
                      role: "user",
                      content,
                    },
                    {
                      id: `assistant-${Date.now()}`,
                      role: "assistant",
                      content: generatingMsg,
                    },
                  ]);
                  setConversationHistory((prev) => [
                    ...prev,
                    { role: "user", content },
                    { role: "assistant", content: generatingMsg },
                  ]);

                  setIsLoading(true);
                  await generateItinerary(tripData);
                  setPhase("free");
                  setIsLoading(false);
                }}
                style={{ backgroundColor: colors.primary, color: "white" }}
                className="mt-4 hover:opacity-90 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Itinerary"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  function renderItineraryTable(data: any) {
    function renderExpenseSummary(expenseSummary: any) {
      if (!expenseSummary || typeof expenseSummary !== "object") return null;

      const {
        perPersonBreakdown,
        totalPerPerson,
        totalForGroup,
        costSavingTips,
      } = expenseSummary;

      return (
        <div
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="mt-8 rounded-lg border overflow-hidden shadow-sm"
        >
          <div
            style={{ backgroundColor: colors.primary, color: "white" }}
            className="p-6"
          >
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="p-3 rounded-lg"
              >
                <IndianRupee className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Expense Breakdown
                </h2>
                <p
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  className="text-xs md:text-sm"
                >
                  Complete cost analysis for your trip
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {perPersonBreakdown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {Object.entries(perPersonBreakdown).map(
                  ([category, data]: any) => (
                    <div
                      key={category}
                      style={{
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      }}
                      className="rounded-lg p-4 md:p-5 border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {category === "accommodation" && (
                            <Home
                              style={{ color: colors.primary }}
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          )}
                          {category === "food" && (
                            <Utensils
                              style={{ color: colors.primary }}
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          )}
                          {category === "activities" && (
                            <Map
                              style={{ color: colors.primary }}
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          )}
                          {category === "transport" && (
                            <TrendingUp
                              style={{ color: colors.primary }}
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          )}
                          {![
                            "accommodation",
                            "food",
                            "activities",
                            "transport",
                          ].includes(category) && (
                            <IndianRupee
                              style={{ color: colors.primary }}
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          )}
                          <h4
                            style={{ color: colors.text }}
                            className="font-semibold capitalize text-sm md:text-base"
                          >
                            {category === "miscellaneous"
                              ? "Misc. Expenses"
                              : category}
                          </h4>
                        </div>
                        <span
                          style={{ color: colors.primary }}
                          className="text-xl md:text-2xl font-bold"
                        >
                          {data.amount}
                        </span>
                      </div>
                      {Array.isArray(data.details) &&
                        data.details.length > 0 && (
                          <ul className="space-y-1.5">
                            {data.details.map((detail: string, i: number) => (
                              <li
                                key={i}
                                style={{ color: colors.textMuted }}
                                className="text-xs md:text-sm flex items-start gap-2"
                              >
                                <span
                                  style={{ color: colors.primary }}
                                  className="mt-0.5"
                                >
                                  •
                                </span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {totalPerPerson && (
                <div
                  style={{
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  }}
                  className="rounded-lg p-5 md:p-6 text-center border-2"
                >
                  <p
                    style={{ color: colors.textMuted }}
                    className="text-xs md:text-sm font-medium mb-2"
                  >
                    Total Per Person
                  </p>
                  <p
                    style={{ color: colors.primary }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    {totalPerPerson}
                  </p>
                </div>
              )}
              {totalForGroup && (
                <div
                  style={{ backgroundColor: colors.primary, color: "white" }}
                  className="rounded-lg p-5 md:p-6 text-center shadow-md"
                >
                  <p className="text-xs md:text-sm opacity-90 font-medium mb-2">
                    Total for Group
                  </p>
                  <p className="text-3xl md:text-4xl font-bold">
                    {totalForGroup}
                  </p>
                </div>
              )}
            </div>

            {Array.isArray(costSavingTips) && costSavingTips.length > 0 && (
              <div
                style={{
                  backgroundColor: colors.accentLight,
                  borderColor: colors.accent,
                }}
                className="border rounded-lg p-4 md:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    className="p-2 rounded-lg"
                  >
                    <TrendingUp
                      style={{ color: colors.accent }}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  </div>
                  <h4
                    style={{ color: colors.text }}
                    className="font-bold text-base md:text-lg"
                  >
                    Money-Saving Tips
                  </h4>
                </div>
                <ul className="space-y-3">
                  {costSavingTips.map((tip: string, i: number) => (
                    <li
                      key={i}
                      style={{ color: colors.textMuted }}
                      className="flex items-start gap-3 text-xs md:text-sm"
                    >
                      <span
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          color: colors.accent,
                        }}
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs mt-0.5"
                      >
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (!data || typeof data !== "object") {
      return <p style={{ color: colors.textMuted }}>Invalid itinerary data</p>;
    }

    return (
      <div className="space-y-6 max-w-5xl">
        {/* Header Section */}
        {/* const colors = {
  primary: "#FF7729",
  primaryHover: "#E56A1F",
  primaryLight: "#FFF5F0",
  primaryDark: "#D45A1A",
  secondary: "#F9F7F4",
  secondaryHover: "#F0EDEA",
  card: "#FFFFFF",
  border: "#E8E3DE",
  text: "#1F2937",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  accent: "#10B981",
  accentLight: "#ECFDF5",
}; */}
        <div
          style={{ backgroundColor: "#E56A1F", color: "white" }}
          className="rounded-lg p-6 md:p-8 shadow-md"
        >
          <div className="flex items-start gap-3 md:gap-4 mb-4 ">
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              className="p-2 md:p-3 rounded-lg "
            >
              <MapPin className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {data.destination || "Your Dream Trip"}
              </h1>
              {data.summary && (
                <p
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  className="text-sm md:text-lg leading-relaxed"
                >
                  {data.summary}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 mt-6">
            {data.duration && (
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="flex items-center gap-2 rounded-full px-3 md:px-4 py-2"
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm md:text-base">
                  {data.duration}
                </span>
              </div>
            )}
            {data.totalBudget && (
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="flex items-center gap-2 rounded-full px-3 md:px-4 py-2"
              >
                <span className="font-medium text-sm md:text-base">
                  {data.totalBudget}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Overview */}
        {data.budgetBreakdown && (
          <div
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="rounded-lg p-4 md:p-6 border shadow-sm"
          >
            <h3
              style={{ color: colors.text }}
              className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2"
            >
              <IndianRupee
                style={{ color: colors.primary }}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              Budget Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {Object.entries(data.budgetBreakdown).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                  }}
                  className="text-center p-3 md:p-4 rounded-lg border"
                >
                  <p
                    style={{ color: colors.textMuted }}
                    className="text-xs mb-1 capitalize"
                  >
                    {key}
                  </p>
                  <p
                    style={{ color: colors.primary }}
                    className="text-lg md:text-xl font-bold"
                  >
                    {value as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        {Array.isArray(data.itineraryTable) &&
          data.itineraryTable.length > 0 && (
            <div className="space-y-6">
              {data.itineraryTable.map((day: any, index: number) => (
                <div
                  key={day.day || index}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Day Header */}
                  <div
                    style={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.border,
                    }}
                    className="p-4 md:p-5 border-b"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4
                          style={{ color: colors.text }}
                          className="text-lg md:text-xl font-bold"
                        >
                          Day {day.day || index + 1}
                        </h4>
                        {day.theme && (
                          <p
                            // style={{ color: colors.textMuted }}
                            className="font-medium mt-1 text-sm md:text-base"
                          >
                            {day.theme}
                          </p>
                        )}
                      </div>
                      {day.dailyCost && (
                        <div
                          style={{
                            backgroundColor: colors.primary,
                            color: "white",
                          }}
                          className="px-3 md:px-4 py-2 rounded-full font-bold shadow-sm text-sm md:text-base whitespace-nowrap"
                        >
                          {day.dailyCost}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile: Stacked Cards */}
                  <div className="block md:hidden p-3 space-y-3">
                    {Array.isArray(day.rows) &&
                      day.rows.map((row: any, i: number) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor: colors.secondary,
                            borderColor: colors.border,
                          }}
                          className="rounded-lg p-4 border shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            {row.time && (
                              <div
                                style={{ color: colors.primary }}
                                className="flex items-center gap-2 font-semibold text-sm"
                              >
                                <Clock className="w-4 h-4" />
                                {row.time}
                              </div>
                            )}
                            {row.pricing && (
                              <span
                                style={{
                                  backgroundColor: colors.primary,
                                  color: "white",
                                }}
                                className="px-2.5 py-1 rounded-full text-xs font-bold"
                              >
                                {row.pricing}
                              </span>
                            )}
                          </div>
                          {row.activity && (
                            <h5
                              style={{ color: colors.text }}
                              className="font-bold mb-2 text-base"
                            >
                              {row.activity}
                            </h5>
                          )}
                          {row.description && (
                            <p
                              style={{ color: colors.textMuted }}
                              className="text-sm mb-2 leading-relaxed"
                            >
                              {row.description}
                            </p>
                          )}
                          {row.distance && (
                            <div
                              style={{ color: colors.textMuted }}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Map className="w-3 h-3" />
                              {row.distance}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="hidden md:block overflow-x-auto -mx-1">
                    <div className="min-w-[640px] md:min-w-0">
                      <table className="w-full text-xs md:text-sm border-collapse">
                        <thead className="bg-[#DA880F]/10 text-[#DA880F] sticky top-0 z-10">
                          <tr>
                            <th className="border px-3 py-2 text-left font-medium">
                              Time
                            </th>
                            <th className="border px-3 py-2 text-left font-medium">
                              Activity
                            </th>
                            <th className="border px-3 py-2 text-left font-medium">
                              Description
                            </th>
                            <th className="border px-3 py-2 text-left font-medium">
                              Distance
                            </th>
                            <th className="border px-3 py-2 text-left font-medium">
                              Pricing
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(day.rows) &&
                            day.rows.map((row: any, i: number) => (
                              <tr
                                key={i}
                                className="border-t hover:bg-[#DA880F]/5"
                              >
                                <td className="border px-3 py-2 font-medium text-nowrap">
                                  {row.time || "-"}
                                </td>
                                <td className="border px-3 py-2 font-medium">
                                  {row.activity || "-"}
                                </td>
                                <td className="border px-3 py-2 text-gray-700">
                                  {row.description || "-"}
                                </td>
                                <td className="border px-3 py-2 text-gray-600">
                                  {row.distance || "-"}
                                </td>
                                <td className="border px-3 py-2 font-semibold text-[#DA880F]">
                                  {row.pricing || "-"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Meals & Accommodation */}
                  <div
                    style={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.border,
                    }}
                    className="p-4 md:p-5 border-t space-y-3"
                  >
                    {day.meals && (
                      <div className="space-y-2">
                        <div
                          style={{ color: colors.text }}
                          className="flex items-center gap-2 font-semibold mb-2"
                        >
                          <Utensils
                            style={{ color: colors.primary }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm md:text-base">Meals</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs md:text-sm">
                          {day.meals.breakfast && (
                            <div
                              style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                              }}
                              className="rounded-lg p-3 border"
                            >
                              <span
                                style={{ color: colors.primary }}
                                className="font-medium"
                              >
                                Breakfast:
                              </span>
                              <p
                                style={{ color: colors.textMuted }}
                                className="mt-1"
                              >
                                {day.meals.breakfast}
                              </p>
                            </div>
                          )}
                          {day.meals.lunch && (
                            <div
                              style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                              }}
                              className="rounded-lg p-3 border"
                            >
                              <span
                                style={{ color: colors.primary }}
                                className="font-medium"
                              >
                                Lunch:
                              </span>
                              <p
                                style={{ color: colors.textMuted }}
                                className="mt-1"
                              >
                                {day.meals.lunch}
                              </p>
                            </div>
                          )}
                          {day.meals.dinner && (
                            <div
                              style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                              }}
                              className="rounded-lg p-3 border"
                            >
                              <span
                                style={{ color: colors.primary }}
                                className="font-medium"
                              >
                                Dinner:
                              </span>
                              <p
                                style={{ color: colors.textMuted }}
                                className="mt-1"
                              >
                                {day.meals.dinner}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {day.accommodation && (
                      <div
                        style={{
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        }}
                        className="rounded-lg p-3 md:p-4 border"
                      >
                        <div
                          style={{ color: colors.text }}
                          className="flex items-center gap-2 font-semibold mb-2"
                        >
                          <Home
                            style={{ color: colors.primary }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm md:text-base">
                            Accommodation
                          </span>
                        </div>
                        <p
                          style={{ color: colors.textMuted }}
                          className="text-xs md:text-sm"
                        >
                          {day.accommodation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Expense Summary */}
        {data?.expenseSummary && renderExpenseSummary(data?.expenseSummary)}

        {/* Local Tips */}
        {Array.isArray(data.localTips) && data.localTips.length > 0 && (
          <div
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.border,
            }}
            className="border rounded-lg p-4 md:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{ backgroundColor: "rgba(255, 119, 41, 0.1)" }}
                className="p-2 md:p-3 rounded-lg"
              >
                <Info
                  style={{ color: colors.primary }}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
              <h3
                style={{ color: colors.text }}
                className="text-lg md:text-xl font-bold"
              >
                Local Insider Tips
              </h3>
            </div>
            <ul className="space-y-3">
              {data.localTips.map((tip: string, i: number) => (
                <li
                  key={i}
                  style={{ color: colors.textMuted }}
                  className="flex items-start gap-3 text-xs md:text-sm"
                >
                  <span
                    style={{
                      backgroundColor: "rgba(255, 119, 41, 0.1)",
                      color: colors.primary,
                    }}
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs mt-0.5"
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total Cost Footer */}
        {data.totalEstimatedCost && (
          <div
            style={{ color: "black" }}
            className="rounded-lg p-6 md:p-8 text-center"
          >
            <p className="text-xs md:text-sm opacity-90 font-medium mb-2">
              Total Estimated Trip Cost
            </p>
            <p className="text-4xl md:text-5xl font-bold mb-4">
              {data.totalEstimatedCost}
            </p>
            <div className="flex justify-center">
              <ItineraryPDFExport itineraryData={data} tripData={tripData} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div
      style={{ backgroundColor: "#FFF9F3" }}
      className="flex flex-col h-screen mt-20"
    >
      {/* <div
        style={{ borderColor: colors.border }}
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b"
      >
        {currentItinerary && (
          <Button
            style={{ backgroundColor: colors.primary, color: "white" }}
            className="hover:opacity-90 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg shadow-sm flex items-center gap-1 md:gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
      </div> */}

      {/* Chat Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 md:px-6 pb-32 md:pb-36 pt-4 md:pt-6 space-y-3 md:space-y-4"
      >
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                style={{
                  backgroundColor:
                    m.role === "user" ? colors.primary : colors.card,
                  color: m.role === "user" ? "white" : colors.text,
                  borderColor:
                    m.role === "user" ? colors.primary : colors.border,
                }}
                className={cn(
                  "max-w-full sm:max-w-[85%] rounded-lg px-4 md:px-5 py-3 md:py-4 shadow-sm text-xs md:text-sm",
                  m.role === "user" ? "" : "border"
                )}
              >
                {m.role === "assistant" && isProbablyJson(m.content) ? (
                  renderItineraryTable(safeParseJSON(m.content) || {})
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {phase === "guided" && renderQuestionComponent()}
          {isLoading && (
            <div className="flex justify-start">
              <div
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="border rounded-lg px-5 md:px-6 py-3 md:py-4 shadow-sm"
              >
                <div className="flex gap-2">
                  <div
                    style={{ backgroundColor: colors.primary }}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-bounce"
                  />
                  <div
                    style={{ backgroundColor: colors.primary }}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-bounce [animation-delay:0.2s]"
                  />
                  <div
                    style={{ backgroundColor: colors.primary }}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-bounce [animation-delay:0.4s]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="fixed -bottom-2 left-0 right-0  bg-white">
        <div className="max-w-4xl mx-auto px-3 md:px-6 py-3 md:py-2">
          <div
            style={{
              backgroundColor: colors.primaryLight,
              borderColor: colors.border,
            }}
            className="rounded-lg p-3 md:p-3.5 mb-2 md:mb-3 border"
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                style={{ color: colors.primary }}
                className="w-4 h-4 mt-0.5 "
              />
              <p
                style={{ color: colors.textMuted }}
                className="text-xs leading-relaxed"
              >
                Chat history is not saved. Please export your itinerary as PDF
                before leaving.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="flex items-center gap-2 md:gap-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow p-1.5 md:p-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  phase === "guided"
                    ? "Type your answer here..."
                    : "Ask me anything or request changes..."
                }
                style={{ color: colors.text }}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-transparent border-none focus:outline-none placeholder-gray-400 text-sm md:text-base"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{ backgroundColor: colors.primary, color: "white" }}
                className="hover:opacity-90 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow-sm flex items-center gap-1 md:gap-2 transition-all"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline text-sm md:text-base">
                  Send
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
