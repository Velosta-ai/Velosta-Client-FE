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
  loading?: boolean;
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

  /* ---------------- Loading Skeleton ---------------- */
  if (loading) {
    return (
      <Card className="p-6 bg-[#FFF9ED] border border-[#FFE5D1] rounded-2xl shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/3 bg-[#FFE5D1]/50 rounded-lg"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-[#FFE5D1]/40 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  /* ---------------- Main ---------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-[#FFE5D1]/50 border border-[#FFE5D1] rounded-2xl shadow-sm hover:shadow-md transition-all h-fit">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
              <Users className="w-4 h-4 text-[#FF792A]" />
              Members
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {members.length} {members.length === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {members.length === 0 && !isAdding && (
          <motion.div
            className="py-8 text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No members yet. Add your first one!
          </motion.div>
        )}

        {/* Member List */}
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
                className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-[#FFE5D1]/80 hover:bg-[#FFF9ED] transition-all group"
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
                  <span className="text-sm font-medium text-gray-800">
                    {member.name}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                  className="h-7 w-7 p-0 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Add Member Section */}
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full gap-2 rounded-lg border-[#FFE5D1] h-9 text-sm hover:bg-[#FFF9ED]/70 transition-colors text-gray-800"
          >
            <Plus className="w-4 h-4 text-[#FF792A]" />
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
              className="h-9 rounded-lg border border-[#FFE5D1] bg-white text-sm focus:ring-2 focus:ring-[#FF792A]/50"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddMember}
                disabled={isSubmitting}
                className="flex-1 h-9 rounded-lg text-sm bg-[#FF792A] text-white hover:bg-[#FF792A]/90 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
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
                className="flex-1 h-9 rounded-lg text-sm border-[#FFE5D1] text-gray-700 hover:bg-[#FFE5D1]/50 transition-colors"
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
