'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ReloadWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ReloadWarningDialog({
  open,
  onOpenChange,
  onConfirm,
}: ReloadWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Are you sure you want to leave?
          </DialogTitle>
          <DialogDescription>
            If you reload or leave this page, all your answers will be lost and your test progress will not be saved.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              Your answers have not been submitted yet. Please submit your test before leaving.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stay on Page
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
