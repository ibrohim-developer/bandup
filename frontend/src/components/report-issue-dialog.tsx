"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ISSUE_TYPES = [
  { value: "ui_bug", label: "UI Bug" },
  { value: "audio_issue", label: "Audio Problem" },
  { value: "question_error", label: "Question Error" },
  { value: "content_mistake", label: "Content Mistake" },
  { value: "other", label: "Other" },
];

interface ReportIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: string;
}

export function ReportIssueDialog({
  open,
  onOpenChange,
  module,
}: ReportIssueDialogProps) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose(val: boolean) {
    if (!val) {
      if (preview) URL.revokeObjectURL(preview);
      setType("");
      setDescription("");
      setImage(null);
      setPreview(null);
    }
    onOpenChange(val);
  }

  async function handleSubmit() {
    if (!type || !description.trim()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("description", description);
      formData.append("page_url", window.location.pathname);
      if (module) formData.append("module", module);
      if (image) formData.append("image", image);

      const res = await fetch("/api/report-issue", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      toast.success("Report submitted. Thank you!");
      handleClose(false);
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Found a bug or problem? Let us know and we will fix it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="issue-description">Description</Label>
            <Textarea
              id="issue-description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Screenshot (optional)</Label>
            {preview ? (
              <div className="relative w-full rounded-md border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-40 object-contain bg-muted"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1.5 right-1.5 rounded-full bg-background/80 p-0.5 hover:bg-background transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                <ImagePlus className="h-4 w-4" />
                Attach a screenshot
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!type || !description.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
