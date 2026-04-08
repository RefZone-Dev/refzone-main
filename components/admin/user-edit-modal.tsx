'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface UserEditModalProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function UserEditModal({ userId, open, onOpenChange, onUpdate }: UserEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    experience_level: 'none',
    is_admin: false,
    total_points: 0,
    current_streak: 0,
  })

  useEffect(() => {
    if (userId && open) {
      fetchUserData()
    }
  }, [userId, open])

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      if (!res.ok) {
        toast.error('Failed to load user data')
        return
      }
      const data = await res.json()
      setFormData({
        display_name: data.display_name || '',
        experience_level: data.experience_level || 'none',
        is_admin: data.is_admin || false,
        total_points: data.total_points || 0,
        current_streak: data.current_streak || 0,
      })
    } catch {
      toast.error('Failed to load user data')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('User updated successfully')
        onUpdate()
        onOpenChange(false)
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select
              value={formData.experience_level}
              onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
            >
              <SelectTrigger id="experience_level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_points">Total Points</Label>
            <Input
              id="total_points"
              type="number"
              value={formData.total_points}
              onChange={(e) => setFormData({ ...formData, total_points: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_streak">Current Streak</Label>
            <Input
              id="current_streak"
              type="number"
              value={formData.current_streak}
              onChange={(e) => setFormData({ ...formData, current_streak: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2 col-span-2">
            <Switch
              id="is_admin"
              checked={formData.is_admin}
              onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
            />
            <Label htmlFor="is_admin">Admin Status</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
