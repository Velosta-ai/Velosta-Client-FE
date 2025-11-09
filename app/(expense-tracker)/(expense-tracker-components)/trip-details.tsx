"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  RefreshCcw,
  Trash,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import MembersSection from "../(expense-tracker-components)/members-section";
import ExpensesList from "../(expense-tracker-components)/expense-list";
import AddExpenseModal from "../(expense-tracker-components)/add-expense-modal";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { useUser } from "@/app/utils/context";

export default function TripDetails({
  tripId,
  tripName,
  onBack,
  handleDeleteTrip,
  createdUserId,
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const { user } = useUser();

  /* ------------------------ FETCH DATA ------------------------ */
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
          throw new Error("Failed to fetch trip data");

        const [membersData, expensesData] = await Promise.all([
          membersRes.json(),
          expensesRes.json(),
        ]);

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

  const handleRetry = () => setRetryKey((k) => k + 1);

  /* ------------------------ ADD/REMOVE MEMBERS ------------------------ */
  const handleAddMember = async (name: string) => {
    try {
      const newMember = {
        name,
        avatar: name.slice(0, 2).toUpperCase(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
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
      toast({ title: "Member added", description: `${name} was added.` });
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
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove member");
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Member removed" });
    } catch (err: any) {
      toast({
        title: "Error removing member",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ------------------------ EXPENSES ------------------------ */
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
      toast({ title: "Expense added", description: `${expense.title} added.` });
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
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      toast({ title: "Expense deleted" });
    } catch (err: any) {
      toast({
        title: "Error deleting expense",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ------------------------ DELETE TRIP ------------------------ */
  const confirmDeleteTrip = async () => {
    try {
      setDeletingTrip(true);
      await handleDeleteTrip();
      toast({ title: "Trip deleted", description: "Redirecting..." });
      setTimeout(() => router.push("/expense-tracker"), 1000);
    } catch (err: any) {
      toast({
        title: "Error deleting trip",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingTrip(false);
      setIsDeleteConfirmOpen(false);
      onBack();
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  /* ------------------------ LOADING STATE ------------------------ */
  if (loading)
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
      </div>
    );

  /* ------------------------ ERROR STATE ------------------------ */
  if (error)
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={handleRetry}
          className="gap-2 border-brand-accent text-brand-accent hover:bg-brand-surface"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );

  /* ------------------------ MAIN UI ------------------------ */
  return (
    <>
      <motion.div
        className="min-h-screen bg-brand-bg pt-24 pb-16 transition-all"
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
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-9 w-9 p-0 rounded-lg hover:bg-brand-surface"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {tripName}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage expenses and members
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="gap-2 h-10 rounded-lg bg-brand-accent text-white hover:shadow-lg transition bg-[black]"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>

              {createdUserId === user?.id && (
                <Button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={deletingTrip}
                  className="gap-2 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  {deletingTrip ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                  {deletingTrip ? "Deleting..." : "Delete Trip"}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Total Summary */}
          <Card className="p-6 mb-8 bg-brand-surface rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  ₹{totalExpenses.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Members</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {members.length}
                </p>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </div>
        </main>

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddExpense}
          members={members}
        />
      </motion.div>

      {/* Delete Trip Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-sm bg-white rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{tripName}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={deletingTrip}
              className="hover:bg-brand-surface"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTrip}
              disabled={deletingTrip}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingTrip && <Loader2 className="w-4 h-4 animate-spin" />}
              {deletingTrip ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
