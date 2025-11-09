"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";

interface Member {
  id: number;
  name: string;
  avatar: string;
  color: string;
}

interface MembersListProps {
  members: Member[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: number) => void;
}

export default function MembersList({
  members,
  onAddMember,
  onRemoveMember,
}: MembersListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const handleAddClick = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName);
      setNewMemberName("");
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-6 bg-[#FFE5D1]/60 border border-[#FFE5D1] rounded-2xl shadow-sm hover:shadow-md transition-all sticky top-20 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">Members</h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-lg hover:bg-[#FFE5D1]/60 transition-colors"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 text-[#FF792A]" />
        </Button>
      </div>

      {/* Member List */}
      <div className="space-y-2 mb-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/40 hover:bg-[#FFF9ED]/80 border border-[#FFE5D1]/70 transition-all group"
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
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              onClick={() => onRemoveMember(member.id)}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Member Input */}
      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddClick()}
            className="h-9 text-sm rounded-lg border border-[#FFE5D1] focus:ring-2 focus:ring-[#FF792A]/50 bg-white"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddClick}
            className="h-9 px-3 text-sm bg-[#FF792A] text-white hover:bg-[#FF792A]/90 rounded-lg transition-all"
          >
            Add
          </Button>
        </div>
      )}

      {/* Empty State */}
      {members.length === 0 && !isAdding && (
        <p className="text-sm text-gray-600 text-center py-4">
          No members yet. Add one to get started!
        </p>
      )}
    </Card>
  );
}
