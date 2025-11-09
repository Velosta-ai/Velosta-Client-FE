import { Card } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalExpense: number;
  memberCount: number;
}

export default function StatsCards({
  totalExpense,
  memberCount,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${totalExpense}
            </p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Members
            </p>
            <p className="text-3xl font-bold text-foreground">{memberCount}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>
    </div>
  );
}
