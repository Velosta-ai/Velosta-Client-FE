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
            <Label htmlFor="title">Title</Label>
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
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-5 gap-2">
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
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`h-9 rounded-lg border ${
                errors.amount ? "border-destructive" : "border-border"
              }`}
            />
          </div>

          {/* Who Paid */}
          <div className="space-y-2">
            <Label>Who Paid?</Label>
            {members.map((member) => (
              <Button
                key={member.id}
                variant={formData.payerId === member.id ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, payerId: member.id })}
                className="w-full justify-start gap-2 h-9 rounded-lg text-sm"
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

          {/* Split Between */}
          <div className="space-y-2">
            <Label>Split Between</Label>
            <div className="space-y-2 p-3 bg-secondary/20 rounded-lg max-h-40 overflow-y-auto border border-border/50">
              {members.map((member) => (
                <motion.label
                  key={member.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-secondary/30 p-2 rounded transition-colors"
                >
                  <Checkbox
                    checked={formData.splitMemberIds.includes(member.id)}
                    onCheckedChange={() => toggleMemberSplit(member.id)}
                    className="rounded"
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
                  <span className="text-sm font-medium">{member.name}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Split Summary */}
          <motion.div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
            <p className="text-xs text-muted-foreground">
              Split equally among {splitCount} people
            </p>
            <p className="text-lg font-semibold text-foreground">
              ₹{perPersonAmount} each
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-lg h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-lg h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
