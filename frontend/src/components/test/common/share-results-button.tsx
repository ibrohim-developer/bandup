"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Share2, Download, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareResultsButtonProps {
  attemptId: string;
  /** Full-mock-test attempt (uses ?type=mock on the image route). */
  mock?: boolean;
  shareText: string;
  className?: string;
}

export function ShareResultsButton({
  attemptId,
  mock,
  shareText,
  className,
}: ShareResultsButtonProps) {
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadImage = async () => {
    try {
      const params = new URLSearchParams();
      if (mock) params.set("type", "mock");
      if (resolvedTheme === "dark") params.set("theme", "dark");
      const query = params.toString();
      const res = await fetch(`/api/share-card/${attemptId}${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error("Image generation failed");
      const imageBlob = await res.blob();
      setBlob(imageBlob);
      setPreviewUrl(URL.createObjectURL(imageBlob));
    } catch {
      toast.error("Could not generate the share image. Please try again.");
      setOpen(false);
    }
  };

  // Fetch the card when the dialog opens (not on the Share click) so the
  // navigator.share call stays synchronous — iOS Safari drops the user
  // activation if the click handler awaits a fetch first.
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value && !blob) void loadImage();
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const anchor = document.createElement("a");
    anchor.href = previewUrl;
    anchor.download = "bandup-result.png";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleShare = async () => {
    if (!blob || isSharing) return;
    const file = new File([blob], "bandup-result.png", { type: "image/png" });
    if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
      setIsSharing(true);
      try {
        await navigator.share({ files: [file], text: shareText });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          toast.error("Sharing failed. Try downloading the image instead.");
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      handleDownload();
      toast.info("Image downloaded — share it to your story!");
    }
  };

  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(
    "https://bandup.uz",
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "gap-2 px-5 md:px-8 h-11 md:h-12 rounded-xl font-bold text-sm md:text-md uppercase flex items-center justify-center",
            className,
          )}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
            Share your result
          </DialogTitle>
          <DialogDescription>
            Post your score to your Instagram or Telegram story.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-2">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Your result card"
              className="max-h-[45vh] rounded-xl border border-border"
            />
          ) : (
            <div className="flex h-[45vh] aspect-[9/16] items-center justify-center rounded-xl border border-border bg-muted/30">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleShare}
            disabled={!blob || isSharing}
            className="w-full gap-2 h-11 rounded-xl font-bold uppercase"
          >
            <Share2 className="h-4 w-4" />
            Share to story
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!previewUrl}
              className="flex-1 gap-2 h-11 rounded-xl font-bold uppercase"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 gap-2 h-11 rounded-xl font-bold uppercase"
            >
              <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4" />
                Telegram
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
