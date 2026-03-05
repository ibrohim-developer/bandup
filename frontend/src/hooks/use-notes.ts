"use client";

import { useState, useCallback } from "react";

export interface Highlight {
  id: string;
  text: string;
}

export interface Note {
  id: string;
  markId: string;
  selectedText: string;
  noteText: string;
  createdAt: Date;
}

export function useNotes() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const addHighlight = useCallback((highlight: Highlight) => {
    setHighlights((prev) => [...prev, highlight]);
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const addNote = useCallback((markId: string, selectedText: string, noteText: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      markId,
      selectedText,
      noteText,
      createdAt: new Date(),
    };
    setNotes((prev) => [...prev, note]);
    return note;
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNoteByMarkId = useCallback(
    (markId: string) => notes.find((n) => n.markId === markId) ?? null,
    [notes]
  );

  return {
    highlights,
    notes,
    addHighlight,
    removeHighlight,
    addNote,
    removeNote,
    getNoteByMarkId,
  };
}
