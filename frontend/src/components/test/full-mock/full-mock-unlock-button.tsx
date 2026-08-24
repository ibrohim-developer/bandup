"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";

export function FullMockUnlockButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
                <Lock className="h-4 w-4" />
                Unlock with Premium
            </Button>
            <PremiumUpgradeDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
