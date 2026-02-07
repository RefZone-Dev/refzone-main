'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Trash2, UserCheck, Download, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BulkActionsToolbarProps {
  selectedIds: string[]
  onActionComplete: () => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({ selectedIds, onActionComplete, onClearSelection }: BulkActionsToolbarProps) {
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleBulkAction = async () => {
    if (!action || selectedIds.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedIds }),
      })

      if (res.ok) {
        toast.success(`Bulk action completed for ${selectedIds.length} users`)
        onActionComplete()
        onClearSelection()
        setAction('')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Bulk action failed')
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
      toast.error('Bulk action failed')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const handleActionSelect = (value: string) => {
    setAction(value)
    if (value === 'delete') {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
    }
  }

  const executeAction = () => {
    if (action === 'delete') {
      setShowConfirm(true)
    } else {
      handleBulkAction()
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
        <span className="text-sm font-medium">
          {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''} selected
        </span>

        <Select value={action} onValueChange={handleActionSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="send_notification">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Notification
              </div>
            </SelectItem>
            <SelectItem value="reset_password">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Send Password Reset
              </div>
            </SelectItem>
            <SelectItem value="grant_admin">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Grant Admin
              </div>
            </SelectItem>
            <SelectItem value="revoke_admin">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Revoke Admin
              </div>
            </SelectItem>
            <SelectItem value="export">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </div>
            </SelectItem>
            <SelectItem value="delete">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Users
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={executeAction} disabled={!action || loading}>
          {loading ? 'Processing...' : 'Execute'}
        </Button>

        <Button variant="outline" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''} and all their associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAction} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
