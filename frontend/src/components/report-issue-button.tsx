"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportIssueDialog } from "@/components/report-issue-dialog";

interface ReportIssueButtonProps {
  module?: string;
}

export function ReportIssueButton({ module }: ReportIssueButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 left-4 z-50 gap-1.5 shadow-md opacity-60 hover:opacity-100 transition-opacity"
        onClick={() => setOpen(true)}
        aria-label="Report an issue"
      >
        <Flag className="h-3.5 w-3.5" />
        <span className="text-xs">Report Issue</span>
      </Button>

      <ReportIssueDialog open={open} onOpenChange={setOpen} module={module} />
    </>
  );
}
