"use client";

import Navbar from "@/components/navbar";
import VelostaAITripPlanner from "@/components/velosta-ai/velosta-ai-triplanner";
import ProtectedRoute from "../utils/protected-routes";

function PlanPage() {
  return (
    // <ProtectedRoute>
    //   <div className="min-h-screen flex flex-col">
    //     <Navbar />
    //     <main className="w-full flex-1 pt-[96px]">
    //       <VelostaAITripPlanner />
    //     </main>
    //   </div>
    // </ProtectedRoute>
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* <Navbar /> */}
        {/* <main className="w-full flex-1 pt-[96px]"> */}
          <VelostaAITripPlanner />
        {/* </main> */}
      </div>
    </ProtectedRoute>
  );
}

export default PlanPage;
