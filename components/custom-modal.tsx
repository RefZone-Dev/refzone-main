"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"

type ModalType = "success" | "error" | "warning" | "info" | "confirm"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  type?: ModalType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  type = "info",
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
}: CustomModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "confirm":
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {type === "confirm" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button onClick={handleConfirm}>{confirmText}</Button>
            </>
          ) : (
            <Button onClick={onClose}>{confirmText}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
