"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => Promise<void> | void;
  members: Member[];
}

const categories = ["Food", "Stay", "Travel", "Shopping", "Other"];

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  members,
}: AddExpenseModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    payerId: members[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    splitMemberIds: members.map((m) => m.id),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    if (!formData.splitMemberIds.length)
      newErrors.split = "Select at least one person.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Invalid input",
        description: "Please fix the highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    const payer = members.find((m) => m.id === formData.payerId);
    const newExpense = {
      title: formData.title.trim(),
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      payerId: formData.payerId,
      payer: payer?.name || "",
      date: formData.date,
      splitMemberIds: formData.splitMemberIds,
    };

    try {
      setLoading(true);
      await onSave(newExpense);
      toast({
        title: "Expense added",
        description: `${newExpense.title} has been successfully added.`,
      });
      handleClose();
    } catch (err: any) {
      toast({
        title: "Error adding expense",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      category: "Food",
      amount: "",
      payerId: members[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      splitMemberIds: members.map((m) => m.id),
    });
    setErrors({});
    onClose();
  };

  const toggleMemberSplit = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      splitMemberIds: prev.splitMemberIds.includes(memberId)
        ? prev.splitMemberIds.filter((id) => id !== memberId)
        : [...prev.splitMemberIds, memberId],
    }));
  };

  const splitCount = formData.splitMemberIds.length;
  const perPersonAmount =
    formData.amount && splitCount
      ? (Number.parseFloat(formData.amount) / splitCount).toFixed(2)
      : "0.00";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#FFE5D1] bg-[#FFF9ED] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold bg-amber-600 text-gray-900">
            Add Expense
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter details and select who to split with
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-5 mt-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Dinner at Café"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`h-10 rounded-lg border ${
                errors.title ? "border-red-400" : "border-[#FFE5D1]"
              } bg-white focus:ring-2 focus:ring-[#FF792A]/50`}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-gray-700">Category</Label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={formData.category === cat ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`h-8 text-xs rounded-lg transition-all ${
                    formData.category === cat
                      ? "bg-[#FF792A] text-white hover:bg-[#FF792A]/90"
                      : "border-[#FFE5D1] text-gray-700 hover:bg-[#FFE5D1]/40"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`h-10 rounded-lg border ${
                errors.amount ? "border-red-400" : "border-[#FFE5D1]"
              } bg-white focus:ring-2 focus:ring-[#FF792A]/50`}
            />
          </div>

          {/* Who Paid */}
          <div className="space-y-2">
            <Label className="text-gray-700">Who Paid?</Label>
            <div className="space-y-1">
              {members.map((member) => (
                <Button
                  key={member.id}
                  variant={
                    formData.payerId === member.id ? "default" : "outline"
                  }
                  onClick={() =>
                    setFormData({ ...formData, payerId: member.id })
                  }
                  className={`w-full justify-start gap-2 h-9 rounded-lg transition-all ${
                    formData.payerId === member.id
                      ? "bg-[#FF792A] text-white hover:bg-[#FF792A]/90"
                      : "border-[#FFE5D1] text-gray-700 hover:bg-[#FFE5D1]/40"
                  }`}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback
                      style={{
                        backgroundColor: member.color + "20",
                        color: member.color,
                      }}
                    >
                      {member.avatar[0]}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Split Between */}
          <div className="space-y-2">
            <Label className="text-gray-700">Split Between</Label>
            <div className="space-y-2 p-3 bg-[#FFE5D1]/40 rounded-lg border border-[#FFE5D1] max-h-40 overflow-y-auto">
              {members.map((member) => (
                <motion.label
                  key={member.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[#FFF9ED] p-2 rounded-lg transition-colors"
                >
                  <Checkbox
                    checked={formData.splitMemberIds.includes(member.id)}
                    onCheckedChange={() => toggleMemberSplit(member.id)}
                    className="rounded border-[#FF792A] data-[state=checked]:bg-[#FF792A] data-[state=checked]:text-white"
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      style={{
                        backgroundColor: member.color + "20",
                        color: member.color,
                      }}
                    >
                      {member.avatar[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-800 font-medium">
                    {member.name}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Split Summary */}
          <motion.div className="p-3 bg-[#FFE5D1]/40 rounded-lg border border-[#FFE5D1] space-y-1">
            <p className="text-xs text-gray-600">
              Split equally among {splitCount} people
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{perPersonAmount} each
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-10 rounded-lg border-[#FFE5D1] text-gray-700 hover:bg-[#FFE5D1]/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 h-10 rounded-lg bg-[#FF792A] text-white hover:bg-[#FF792A]/90 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
