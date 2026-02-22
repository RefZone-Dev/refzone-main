'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MoreVertical, Eye, Edit, Trash2, RefreshCw, Users, Shield, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { BulkActionsToolbar } from '@/components/admin/bulk-actions-toolbar'
import { UserDetailsModal } from '@/components/admin/user-details-modal'
import { UserEditModal } from '@/components/admin/user-edit-modal'
import { VerifiedBadge } from '@/components/verified-badge'

interface User {
  id: string
  display_name: string
  email: string
  phone: string | null
  phone_verified: boolean
  date_of_birth: string | null
  experience_level: string
  is_admin: boolean
  is_verified: boolean
  total_points: number
  streak_count: number
  created_at: string
  last_sign_in: string | null
  email_confirmed: boolean
}

interface UsersTableClientProps {
  users: User[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAdmin, setFilterAdmin] = useState<string>('all')
  const [filterExperience, setFilterExperience] = useState<string>('all')
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null)
  const [editUserId, setEditUserId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)

    const matchesAdmin =
      filterAdmin === 'all' ||
      (filterAdmin === 'admin' && user.is_admin) ||
      (filterAdmin === 'user' && !user.is_admin)

    const matchesExperience =
      filterExperience === 'all' || user.experience_level === filterExperience

    return matchesSearch && matchesAdmin && matchesExperience
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, userId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== userId))
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('User deleted successfully')
        router.refresh()
      } else {
        const error = await res.json().catch(() => ({ error: 'Failed to delete user' }))
        toast.error(error.error || error.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success('Password reset email sent')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Failed to send reset email:', error)
      toast.error('Failed to send reset email')
    }
  }

  const handleActionComplete = () => {
    router.refresh()
    setSelectedIds([])
  }

  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all users and their information</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{users.length}</span>
          <span className="text-muted-foreground">Total Users</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAdmin} onValueChange={setFilterAdmin}>
              <SelectTrigger>
                <SelectValue placeholder="Admin Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterExperience} onValueChange={setFilterExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedIds={selectedIds}
          onActionComplete={handleActionComplete}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectOne(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.display_name || 'N/A'}</span>
                        {user.is_verified && <VerifiedBadge />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.email}</span>
                        {user.email_confirmed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.phone}</span>
                          {user.phone_verified ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{calculateAge(user.date_of_birth)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.experience_level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{user.total_points || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{user.streak_count || 0}</span>
                        <span className="text-orange-500">🔥</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.is_admin && (
                          <Badge variant="default">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailsUserId(user.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditUserId(user.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailsModal
        userId={detailsUserId}
        open={detailsUserId !== null}
        onOpenChange={(open) => !open && setDetailsUserId(null)}
      />

      <UserEditModal
        userId={editUserId}
        open={editUserId !== null}
        onOpenChange={(open) => !open && setEditUserId(null)}
        onUpdate={handleActionComplete}
      />
    </div>
  )
}
