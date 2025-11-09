"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Hotel,
  Plane,
  ShoppingBag,
  MoreVertical,
  Trash2,
  ReceiptText,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  payer: string;
  date: string;
  splitMembers?: string[]; // 👈 optional now
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface ExpensesListProps {
  expenses: Expense[];
  members: Member[];
  onDeleteExpense: (id: string) => Promise<void> | void;
  loading?: boolean;
}

const categoryIcons: Record<string, any> = {
  Food: Utensils,
  Stay: Hotel,
  Travel: Plane,
  Shopping: ShoppingBag,
  Other: MoreVertical,
};

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Stay: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Travel:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function ExpensesList({
  expenses,
  members,
  onDeleteExpense,
  loading = false,
}: ExpensesListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  console.log(members.length, "members");
  const handleDelete = async (id: string, title: string) => {
    try {
      setDeletingId(id);
      await onDeleteExpense(id);
      toast({
        title: "Expense deleted",
        description: `${title} has been removed.`,
      });
    } catch (err: any) {
      toast({
        title: "Error deleting expense",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/4 bg-muted/30 rounded-lg" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Expenses</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {expenses.length} transaction{expenses.length !== 1 && "s"}
          </p>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plane className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No expenses yet. Add one to get started!
            </p>
          </motion.div>
        )}

        {/* Expense List */}
        <AnimatePresence>
          <motion.div layout className="space-y-2">
            {expenses.map((expense) => {
              const IconComponent =
                categoryIcons[expense.category] || MoreVertical;

              const splitCount = expense.splitMembers?.length || 1;
              const perPersonAmount = expense.amount / splitCount;
              console.log(expense, "per");
              return (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-xl border border-border hover:bg-secondary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          categoryColors[expense.category]
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {expense.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Paid by{" "}
                          <span className="font-medium">{expense.payer}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        ₹{expense.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {/* ${perPersonAmount} each */}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={deletingId === expense.id}
                      className="h-8 w-8 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 rounded-lg"
                      onClick={() => handleDelete(expense.id, expense.title)}
                    >
                      {deletingId === expense.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      )}
                    </Button>
                  </div>

                  {/* Split Members */}
                  {expense.splitMembers && expense.splitMembers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {expense.splitMembers.map((memberName) => {
                        const member = members.find(
                          (m) => m.name === memberName
                        );
                        return (
                          <div
                            key={memberName}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/40 text-xs"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarFallback
                                className="text-xs font-semibold"
                                style={{
                                  backgroundColor: member?.color + "40",
                                  color: member?.color,
                                }}
                              >
                                {member?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground text-xs font-medium">
                              {memberName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
