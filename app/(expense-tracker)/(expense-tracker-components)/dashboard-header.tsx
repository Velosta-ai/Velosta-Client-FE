import { Plane } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">TravelSplit</h1>
          <p className="text-xs text-muted-foreground">Manage group expenses</p>
        </div>
      </div>
    </header>
  );
}
