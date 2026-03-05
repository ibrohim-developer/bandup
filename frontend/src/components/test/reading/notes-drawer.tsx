"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Trash2 } from "lucide-react";
import type { Note } from "@/hooks/use-notes";

interface NotesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: Note[];
  pendingNoteText: string | null;
  pendingNoteMarkId: string | null;
  activeNoteId: string | null;
  onSaveNote: (markId: string, selectedText: string, noteText: string) => void;
  onDeleteNote: (noteId: string) => void;
  onCancelPending: () => void;
  onSaveComplete: () => void;
  onClearActive: () => void;
  theme: {
    bg: string;
    text: string;
    textMuted: string;
    border: string;
    bgAlt: string;
  };
}

export function NotesDrawer({
  open,
  onOpenChange,
  notes,
  pendingNoteText,
  pendingNoteMarkId,
  activeNoteId,
  onSaveNote,
  onDeleteNote,
  onCancelPending,
  onSaveComplete,
  onClearActive,
  theme,
}: NotesDrawerProps) {
  const [noteInput, setNoteInput] = useState("");
  const activeNoteRef = useRef<HTMLDivElement>(null);
  const isAddMode = !!pendingNoteText && !!pendingNoteMarkId;

  // Scroll to active note when opened via note mark click
  useEffect(() => {
    if (activeNoteId && activeNoteRef.current) {
      activeNoteRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeNoteId, open]);

  const handleSave = () => {
    if (pendingNoteMarkId && pendingNoteText && noteInput.trim()) {
      onSaveNote(pendingNoteMarkId, pendingNoteText, noteInput.trim());
      setNoteInput("");
      onSaveComplete();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (isAddMode) onCancelPending();
      onClearActive();
      setNoteInput("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-80 sm:w-96 flex flex-col"
        style={{
          backgroundColor: theme.bg,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <SheetHeader>
          <SheetTitle
            className="flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <StickyNote className="h-5 w-5" />
            Notes
          </SheetTitle>
          <SheetDescription style={{ color: theme.textMuted }}>
            {isAddMode
              ? "Add a note for the selected text"
              : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1 px-4 pb-4">
          {/* Add Note Form */}
          {isAddMode && (
            <div
              className="rounded-lg p-3 space-y-3"
              style={{
                backgroundColor: theme.bgAlt,
                border: `1px solid ${theme.border}`,
              }}
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: theme.textMuted }}
              >
                &ldquo;{pendingNoteText.length > 200
                  ? pendingNoteText.slice(0, 200) + "..."
                  : pendingNoteText}&rdquo;
              </p>
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write your note..."
                className="min-h-[80px] resize-none"
                autoFocus
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!noteInput.trim()}
                >
                  Save Note
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCancelPending();
                    setNoteInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {notes.length === 0 && !isAddMode && (
            <p
              className="text-sm text-center py-8"
              style={{ color: theme.textMuted }}
            >
              No notes yet. Select text and click &ldquo;Note&rdquo; to add one.
            </p>
          )}

          {notes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                ref={isActive ? activeNoteRef : undefined}
                className="rounded-lg p-3 space-y-2 transition-all"
                style={{
                  backgroundColor: theme.bgAlt,
                  border: `1px solid ${isActive ? theme.text : theme.border}`,
                  boxShadow: isActive ? `0 0 0 1px ${theme.text}` : undefined,
                }}
              >
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: theme.textMuted }}
                >
                  &ldquo;{note.selectedText.length > 120
                    ? note.selectedText.slice(0, 120) + "..."
                    : note.selectedText}&rdquo;
                </p>
                <p className="text-sm" style={{ color: theme.text }}>
                  {note.noteText}
                </p>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="cursor-pointer text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: theme.textMuted }}
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
