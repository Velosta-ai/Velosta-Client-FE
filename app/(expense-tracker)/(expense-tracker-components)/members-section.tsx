"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X, Users, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface MembersSectionProps {
  members: Member[];
  onAddMember: (name: string) => Promise<void> | void;
  onRemoveMember: (id: string) => Promise<void> | void;
  loading?: boolean; // optional loading prop
}

export default function MembersSection({
  members,
  onAddMember,
  onRemoveMember,
  loading = false,
}: MembersSectionProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    try {
      setIsSubmitting(true);
      await onAddMember(newMemberName.trim());
      toast({
        title: "Member added",
        description: `${newMemberName.trim()} joined the trip!`,
      });
      setNewMemberName("");
      setIsAdding(false);
    } catch (err: any) {
      toast({
        title: "Failed to add member",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    try {
      await onRemoveMember(id);
      toast({
        title: "Member removed",
        description: `${name} has been removed from the trip.`,
      });
    } catch (err: any) {
      toast({
        title: "Failed to remove member",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  /* ----------------- Loading Skeleton ----------------- */
  if (loading) {
    return (
      <Card className="p-6 border-border h-fit">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/3 bg-muted/30 rounded-lg"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted/30 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 border-border h-fit rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Members
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {members.length} people
            </p>
          </div>
        </div>

        {/* ---------------- Empty State ---------------- */}
        {members.length === 0 && !isAdding && (
          <motion.div
            className="py-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No members yet. Add your first one!
          </motion.div>
        )}

        {/* ---------------- Member List ---------------- */}
        <AnimatePresence>
          <motion.div layout className="space-y-2 mb-4">
            {members.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 group"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
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
                  <span className="text-sm font-medium text-foreground">
                    {member.name}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                  className="h-7 w-7 p-0 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ---------------- Add Member ---------------- */}
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full gap-2 rounded-lg border-border h-9 text-sm hover:bg-secondary/30"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        ) : (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Input
              placeholder="Member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              autoFocus
              disabled={isSubmitting}
              className="h-8 rounded-lg border-border text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddMember}
                disabled={isSubmitting}
                className="flex-1 h-8 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewMemberName("");
                }}
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 h-8 rounded-lg text-sm border-border"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
