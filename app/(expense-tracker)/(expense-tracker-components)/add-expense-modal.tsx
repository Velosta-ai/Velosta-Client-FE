"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    payer: members[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    splitMembers: members.map((m) => m.id),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    if (!formData.splitMembers.length)
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

    const payer = members.find((m) => m.id === formData.payer);
    const splitMemberNames = members
      .filter((m) => formData.splitMembers.includes(m.id))
      .map((m) => m.name);

    const newExpense = {
      title: formData.title.trim(),
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      payer: payer?.name || "",
      date: formData.date,
      splitMembers: splitMemberNames,
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
      payer: members[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      splitMembers: members.map((m) => m.id),
    });
    setErrors({});
    onClose();
  };

  const toggleMemberSplit = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      splitMembers: prev.splitMembers.includes(memberId)
        ? prev.splitMembers.filter((id) => id !== memberId)
        : [...prev.splitMembers, memberId],
    }));
  };

  const splitCount = formData.splitMembers.length;
  const perPersonAmount =
    formData.amount && splitCount
      ? (Number.parseFloat(formData.amount) / splitCount).toFixed(2)
      : "0.00";
  console.log(formData.amount, splitCount);
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-xl border-border shadow-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Expense
          </DialogTitle>
          <DialogDescription>
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
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Dinner at Café"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`h-9 rounded-lg border ${
                errors.title ? "border-destructive" : "border-border"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <motion.div
              className="grid grid-cols-5 gap-2"
              layout
              transition={{ duration: 0.2 }}
            >
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={formData.category === cat ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className="h-8 text-xs rounded-lg"
                >
                  {cat}
                </Button>
              ))}
            </motion.div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className={`pl-7 h-9 rounded-lg border ${
                  errors.amount ? "border-destructive" : "border-border"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Who Paid */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Who Paid?</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {members.map((member) => (
                <Button
                  key={member.id}
                  variant={formData.payer === member.id ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, payer: member.id })}
                  className="w-full justify-start gap-2 h-9 rounded-lg text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{
                        backgroundColor: member.color + "20",
                        color: member.color,
                      }}
                    >
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Split Between */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Split Between</Label>
            <div className="space-y-2 p-3 bg-secondary/20 rounded-lg max-h-40 overflow-y-auto border border-border/50">
              {members.map((member) => (
                <motion.label
                  key={member.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-secondary/30 p-2 rounded transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Checkbox
                    checked={formData.splitMembers.includes(member.id)}
                    onCheckedChange={() => toggleMemberSplit(member.id)}
                    className="rounded"
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{
                        backgroundColor: member.color + "20",
                        color: member.color,
                      }}
                    >
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium flex-1">
                    {member.name}
                  </span>
                </motion.label>
              ))}
            </div>
            {errors.split && (
              <p className="text-xs text-destructive">{errors.split}</p>
            )}
          </div>

          {/* Split Summary */}
          <motion.div
            className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xs text-muted-foreground">
              Split equally among {splitCount} people
            </p>
            <p className="text-lg font-semibold text-foreground">
              {/* ${perPersonAmount} each */}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-lg h-9 border-border bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-9"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
