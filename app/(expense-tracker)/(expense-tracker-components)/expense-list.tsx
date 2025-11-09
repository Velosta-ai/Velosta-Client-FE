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
  splitMembers?: string[];
  splitMemberIds?: string[];
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
  Food: "bg-[#FFE5D1]/70 text-[#FF792A]",
  Stay: "bg-[#E0F0FF]/70 text-[#0066CC]",
  Travel: "bg-[#F2E6FF]/70 text-[#7A3EF0]",
  Shopping: "bg-[#FFDDE8]/70 text-[#D61F69]",
  Other: "bg-gray-100 text-gray-600",
};

export default function ExpensesList({
  expenses,
  members,
  onDeleteExpense,
  loading = false,
}: ExpensesListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, duration: 0.3, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  /* ---------------- Loader ---------------- */
  if (loading) {
    return (
      <Card className="p-6 rounded-2xl bg-brand-surface border border-brand-surface/70 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/4 bg-[#FF792A]/20 rounded-lg" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#FFF9ED]/70 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  /* ---------------- Main ---------------- */
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      <Card className="p-6 rounded-2xl bg-brand-surface border border-brand-surface/70 shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-brand-accent" />
            <h3 className="font-semibold text-gray-900 text-lg">Expenses</h3>
          </div>
          <p className="text-xs text-gray-500">
            {expenses.length} transaction{expenses.length !== 1 && "s"}
          </p>
        </div>

        {/* Empty state */}
        {expenses.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plane className="w-8 h-8 text-brand-accent mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              No expenses yet. Add one to get started!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-2"
            >
              {expenses.map((expense) => {
                const IconComponent =
                  categoryIcons[expense.category] || MoreVertical;
                const splitCount = expense?.splitMemberIds?.length || 1;
                const perPersonAmount = expense.amount / splitCount;

                return (
                  <motion.div
                    key={expense.id}
                    layout
                    variants={itemVariants}
                    exit="exit"
                    className="p-4 rounded-xl border border-brand-bg hover:bg-[#FFF9ED]/70 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      {/* Left side */}
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`p-2 rounded-lg shadow-sm ${
                            categoryColors[expense.category]
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {expense.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Paid by{" "}
                            <span className="font-medium text-gray-800">
                              {typeof expense.payer === "object"
                                ? expense.payer?.name || "Unknown"
                                : expense.payer || "Unknown"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{expense.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{perPersonAmount.toFixed(2)} each
                        </p>
                      </div>

                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={deletingId === expense.id}
                        className="h-8 w-8 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg"
                        onClick={() => handleDelete(expense.id, expense.title)}
                      >
                        {deletingId === expense.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        )}
                      </Button>
                    </div>

                    {/* Members split chips */}
                    {expense.splitMemberIds &&
                      expense.splitMemberIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {expense.splitMemberIds.map((memberId: string) => {
                            const member = members.find(
                              (m) => m.id === memberId
                            );
                            if (!member) return null;

                            return (
                              <div
                                key={member.id}
                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFF9ED]/90 text-xs border border-[#FFE5D1]"
                              >
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback
                                    className="text-xs font-semibold"
                                    style={{
                                      backgroundColor: member.color + "20",
                                      color: member.color,
                                    }}
                                  >
                                    {member.avatar[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-800 text-xs font-medium">
                                  {member.name}
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
        )}
      </Card>
    </motion.div>
  );
}
