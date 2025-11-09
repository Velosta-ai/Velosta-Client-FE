"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, RefreshCcw } from "lucide-react";
import MembersSection from "../(expense-tracker-components)/members-section";
import ExpensesList from "../(expense-tracker-components)/expense-list";
import AddExpenseModal from "../(expense-tracker-components)/add-expense-modal";
import { useToast } from "@/components/ui/use-toast";

interface TripDetailsProps {
  tripId: string;
  tripName: string;
  onBack: () => void;
}

export default function TripDetails({
  tripId,
  tripName,
  onBack,
}: TripDetailsProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  /* ------------------------------------ */
  /*                FETCH                 */
  /* ------------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [membersRes, expensesRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/members`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/expenses`
          ),
        ]);

        if (!membersRes.ok || !expensesRes.ok)
          throw new Error("Failed to fetch data");

        const [membersData, expensesData] = await Promise.all([
          membersRes.json(),
          expensesRes.json(),
        ]);
        console.log(expensesData, "expenseData");
        setMembers(membersData);
        setExpenses(expensesData);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Failed to load trip data",
          description: "Please check your connection or try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId, retryKey]);

  const handleRetry = () => {
    setRetryKey((k) => k + 1);
  };

  /* ------------------------------------ */
  /*              MEMBERS API             */
  /* ------------------------------------ */
  const handleAddMember = async (name: string) => {
    try {
      const newMember = {
        name,
        avatar: name.slice(0, 2).toUpperCase(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      console.log(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/members`,
        "addmeme"
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
        }
      );
      if (!res.ok) throw new Error("Failed to add member");

      const data = await res.json();
      setMembers((prev) => [...prev, data]);
      toast({
        title: "Member added",
        description: `${name} was added successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to add member",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/members/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to remove member");

      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Member removed", variant: "default" });
    } catch (err: any) {
      toast({
        title: "Error removing member",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ------------------------------------ */
  /*              EXPENSES API            */
  /* ------------------------------------ */
  const handleAddExpense = async (expense: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/expenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense),
        }
      );
      if (!res.ok) throw new Error("Failed to add expense");

      const data = await res.json();
      setExpenses((prev) => [...prev, data]);
      toast({
        title: "Expense added",
        description: `${expense.title} added successfully.`,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({
        title: "Error adding expense",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/expense-tracker/trips/${tripId}/expenses/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      toast({ title: "Expense deleted", variant: "default" });
    } catch (err: any) {
      toast({
        title: "Error deleting expense",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  /* ------------------------------------ */
  /*                UI                    */
  /* ------------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse w-full max-w-2xl space-y-4">
          <div className="h-8 bg-muted/30 rounded-lg"></div>
          <div className="h-24 bg-muted/30 rounded-lg"></div>
          <div className="h-64 bg-muted/30 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={handleRetry}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }
  console.log(expenses, "tripName");
  return (
    <motion.div
      className="min-h-screen bg-background mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-9 w-9 p-0 rounded-lg hover:bg-secondary/50"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {tripName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage expenses and splits
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </motion.div>

        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-6 mb-8 border-border bg-gradient-to-r from-primary/5 to-transparent rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-semibold text-foreground mt-1">
                  ₹{totalExpenses.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-3xl font-semibold text-foreground mt-1">
                  {members.length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MembersSection
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />

          <div className="lg:col-span-2">
            <ExpensesList
              expenses={expenses}
              members={members}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        </motion.div>
      </main>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
        members={members}
      />
    </motion.div>
  );
}
