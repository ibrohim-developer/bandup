"use client";

import { useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumUpgradeDialogProps {
  /** Provide a trigger element for uncontrolled use. The dialog manages its own open state. */
  trigger?: ReactNode;
  /** Controlled open state. Required together with onOpenChange when triggering programmatically. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PremiumUpgradeDialog({ trigger, open, onOpenChange }: PremiumUpgradeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">BandUp Premium</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-1">
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-black text-foreground">49,000</span>
                <span className="text-lg font-semibold text-muted-foreground mb-1">UZS</span>
                <span className="text-sm text-muted-foreground mb-1">/ month</span>
              </div>

              <div className="space-y-2">
                {[
                  "All full mock tests — unlimited access",
                  "AI scoring for Writing & Speaking",
                  "Detailed band score breakdown",
                  "Performance analytics & history",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2 text-sm text-foreground">
                <p className="font-semibold">How to pay:</p>
                <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
                  <li>Transfer <span className="font-bold text-foreground">49,000 UZS</span> to our admin via your bank app</li>
                  <li>Send the payment screenshot to Telegram: <span className="font-bold text-foreground">@bandup_admin</span></li>
                  <li>We will activate your Premium as soon as we verify your payment</li>
                </ol>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href="https://t.me/bandup_admin"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1a8abf] text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
            </svg>
            Contact @bandup_admin on Telegram
          </a>
          <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
