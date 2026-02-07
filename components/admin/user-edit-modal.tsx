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
    email: '',
    phone: '',
    date_of_birth: '',
    experience_level: 'none',
    is_admin: false,
    is_verified: false,
    total_points: 0,
    streak_count: 0,
  })

  useEffect(() => {
    if (userId && open) {
      fetchUserData()
    }
  }, [userId, open])

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      const data = await res.json()
      setFormData({
        display_name: data.display_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        experience_level: data.experience_level || 'none',
        is_admin: data.is_admin || false,
        is_verified: data.is_verified || false,
        total_points: data.total_points || 0,
        streak_count: data.streak_count || 0,
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
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
            <Label htmlFor="streak_count">Streak Count</Label>
            <Input
              id="streak_count"
              type="number"
              value={formData.streak_count}
              onChange={(e) => setFormData({ ...formData, streak_count: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 col-span-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_admin"
                checked={formData.is_admin}
                onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
              />
              <Label htmlFor="is_admin">Admin Status</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_verified"
                checked={formData.is_verified}
                onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
              />
              <Label htmlFor="is_verified">Verified Status</Label>
            </div>
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
