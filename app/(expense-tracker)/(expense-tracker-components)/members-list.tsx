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
    <Card className="p-6 border-border sticky top-20 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Members</h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-lg hover:bg-secondary"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 text-primary" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8" style={{ borderColor: member.color }}>
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
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
              onClick={() => onRemoveMember(member.id)}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddClick()}
            className="h-9 text-sm rounded-lg"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddClick}
            className="h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          >
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}
