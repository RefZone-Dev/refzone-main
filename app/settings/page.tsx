"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth, useUser, useClerk, useSession } from "@clerk/nextjs"
import { Loader2, Info, Moon, Sun, Monitor, User, Mail, Shield, AlertTriangle, Pencil, X, Link2, Smartphone, LogOut, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { CustomModal } from "@/components/custom-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [originalEmail, setOriginalEmail] = useState("")
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [originalFirstName, setOriginalFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [originalLastName, setOriginalLastName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [username, setUsername] = useState("")
  const [originalUsername, setOriginalUsername] = useState("")
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  })
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Connected accounts & sessions
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [isSigningOut, setIsSigningOut] = useState<string | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isTogglingTwoFactor, setIsTogglingTwoFactor] = useState(false)

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const pendingNavigation = useRef<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for unsaved changes
  useEffect(() => {
    const usernameChanged = isEditingUsername && username !== originalUsername
    const nameChanged = isEditingName && (firstName !== originalFirstName || lastName !== originalLastName)
    const emailChanged = isEditingEmail && email !== originalEmail
    setHasUnsavedChanges(usernameChanged || nameChanged || emailChanged)
  }, [username, originalUsername, isEditingUsername, firstName, originalFirstName, lastName, originalLastName, isEditingName, email, originalEmail, isEditingEmail])

  // Handle browser back/navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Intercept link clicks when there are unsaved changes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return
      
      const target = e.target as HTMLElement
      const link = target.closest("a")
      
      if (link && link.href && !link.href.includes("#")) {
        const url = new URL(link.href)
        // Only intercept internal navigation
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          e.preventDefault()
          pendingNavigation.current = url.pathname
          setShowUnsavedModal(true)
        }
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [hasUnsavedChanges])

  const { userId: clerkUserId, signOut } = useAuth()
  const { user: clerkUser } = useUser()
  const clerk = useClerk()
  const { session: currentSession } = useSession()

  useEffect(() => {
    if (!clerkUserId) return

    setUserId(clerkUserId)
    const emailAddr = clerkUser?.primaryEmailAddress?.emailAddress || ""
    setEmail(emailAddr)
    setOriginalEmail(emailAddr)
    setFirstName(clerkUser?.firstName || "")
    setOriginalFirstName(clerkUser?.firstName || "")
    setLastName(clerkUser?.lastName || "")
    setOriginalLastName(clerkUser?.lastName || "")
    setProfileImage(clerkUser?.imageUrl || null)
    setConnectedAccounts(clerkUser?.externalAccounts || [])
    setTwoFactorEnabled((clerkUser?.twoFactorEnabled) || false)

    // Load active sessions via Clerk client
    clerk.client?.sessions && setActiveSessions(clerk.client.sessions || [])

    const supabase = createClient()
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", clerkUserId)
      .single()
      .then(({ data: profile }) => {
        if (profile) {
          setUsername(profile.display_name || "")
          setOriginalUsername(profile.display_name || "")
        }
      })
  }, [clerkUserId, clerkUser])

  // Only check username availability when editing
  useEffect(() => {
    if (!isEditingUsername || !username || !userId || username === originalUsername) {
      setNameAvailable(null)
      return
    }

    setIsCheckingName(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/user/check-display-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: username, currentUserId: userId }),
        })
        const data = await response.json()
        setNameAvailable(data.available)
      } catch {
        setNameAvailable(null)
      } finally {
        setIsCheckingName(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, userId, isEditingUsername, originalUsername])

  const showModal = useCallback((
    type: "success" | "error" | "warning" | "info" | "confirm", 
    title: string, 
    message: string,
    onConfirm?: () => void
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    })
  }, [])

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showModal("warning", "Missing Information", "Please fill in all password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      showModal("warning", "Passwords Don't Match", "New passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      showModal("warning", "Password Too Short", "Password must be at least 8 characters long.")
      return
    }

    setIsChangingPassword(true)

    try {
      // Clerk handles password changes through its user profile
      await clerkUser?.updatePassword({
        currentPassword,
        newPassword,
      })

      showModal("success", "Password Changed", "Your password has been changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      showModal("error", "Password Change Failed", error?.errors?.[0]?.message || error.message || "Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleUpdateName = async () => {
    try {
      await clerkUser?.update({
        firstName: firstName,
        lastName: lastName,
      })
      setOriginalFirstName(firstName)
      setOriginalLastName(lastName)
      setIsEditingName(false)
      showModal("success", "Name Updated", "Your name has been updated successfully.")
    } catch (error: any) {
      showModal("error", "Update Failed", error?.errors?.[0]?.message || "Failed to update name.")
    }
  }

  const handleUpdateEmail = async () => {
    try {
      const emailAddress = await clerkUser?.createEmailAddress({ email })
      if (emailAddress) {
        await clerkUser?.update({ primaryEmailAddressId: emailAddress.id } as any)
      }
      setOriginalEmail(email)
      setIsEditingEmail(false)
      showModal("success", "Email Updated", "Your email has been updated. You may need to verify it.")
    } catch (error: any) {
      showModal("error", "Update Failed", error?.errors?.[0]?.message || "Failed to update email.")
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      await clerkUser?.setProfileImage({ file })
      setProfileImage(clerkUser?.imageUrl || null)
      showModal("success", "Photo Updated", "Your profile photo has been updated.")
    } catch (error: any) {
      showModal("error", "Upload Failed", error?.errors?.[0]?.message || "Failed to upload photo.")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = async () => {
    setIsUploadingImage(true)
    try {
      await clerkUser?.setProfileImage({ file: null })
      setProfileImage(null)
      showModal("success", "Photo Removed", "Your profile photo has been removed.")
    } catch (error: any) {
      showModal("error", "Remove Failed", error?.errors?.[0]?.message || "Failed to remove photo.")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleConnectGoogle = async () => {
    try {
      // Redirect to Clerk's OAuth flow
      window.location.href = `/auth/callback?strategy=oauth_google`
    } catch (error: any) {
      showModal("error", "Connection Failed", error?.message || "Failed to connect Google account.")
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    setIsSigningOut(sessionId)
    try {
      const session = clerk.client?.sessions?.find((s: any) => s.id === sessionId)
      if (session) {
        await session.end()
        setActiveSessions((prev) => prev.filter((s: any) => s.id !== sessionId))
        showModal("success", "Session Ended", "The device has been signed out.")
      }
    } catch (error: any) {
      showModal("error", "Sign Out Failed", error?.errors?.[0]?.message || error?.message || "Failed to end session.")
    } finally {
      setIsSigningOut(null)
    }
  }

  const handleSave = async () => {
    if (!userId) return

    if (isEditingUsername && nameAvailable === false) {
      showModal("error", "Username Taken", "This username is already taken. Please choose another.")
      return
    }

    setIsSaving(true)

    try {
      const supabase = createClient()
      const updateData: Record<string, unknown> = {
          display_name: username,
          has_set_username: true,
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId)

      if (error) throw error

      setOriginalUsername(username)
      setIsEditingUsername(false)
      setHasUnsavedChanges(false)
      showModal("success", "Settings Saved", "Your settings have been saved successfully!")
    } catch (error: any) {
      if (error.code === "23505") {
        showModal("error", "Username Taken", "This username is already in use. Please choose another.")
      } else {
        showModal("error", "Save Failed", "Failed to save settings. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    setUsername(originalUsername)
    setIsEditingUsername(false)
    setHasUnsavedChanges(false)
    setNameAvailable(null)
  }

  const handleSaveAndNavigate = async () => {
    await handleSave()
    if (pendingNavigation.current) {
      router.push(pendingNavigation.current)
      pendingNavigation.current = null
    }
    setShowUnsavedModal(false)
  }

  const handleDiscardAndNavigate = () => {
    handleDiscardChanges()
    if (pendingNavigation.current) {
      router.push(pendingNavigation.current)
      pendingNavigation.current = null
    }
    setShowUnsavedModal(false)
  }

  const handleDeleteAccount = async () => {
    if (!userId) return

    setIsDeleting(true)
    setShowDeleteConfirm(false)

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      showModal("success", "Account Deleted", "Your account has been successfully deleted. Redirecting...")

      setTimeout(async () => {
        await signOut()
        router.push("/")
      }, 1500)
    } catch (error) {
      showModal(
        "error",
        "Delete Failed",
        error instanceof Error ? error.message : "Failed to delete account. Please try again or contact support.",
      )
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancelUsernameEdit = () => {
    setUsername(originalUsername)
    setIsEditingUsername(false)
    setNameAvailable(null)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      {/* Unsaved Changes Modal */}
      <AlertDialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              pendingNavigation.current = null
              setShowUnsavedModal(false)
            }}>
              Stay on Page
            </AlertDialogCancel>
            <Button variant="outline" onClick={handleDiscardAndNavigate} className="bg-transparent">
              Discard Changes
            </Button>
            <AlertDialogAction onClick={handleSaveAndNavigate} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and notifications</p>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span className="text-amber-800 dark:text-amber-200">You have unsaved changes</span>
            <div className="flex gap-2 ml-4">
              <Button size="sm" variant="outline" onClick={handleDiscardChanges} className="bg-transparent">
                Discard
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} className="bg-transparent">
                  Change
                </Button>
                {profileImage && (
                  <Button variant="ghost" size="sm" onClick={handleRemoveImage} disabled={isUploadingImage} className="text-muted-foreground">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            {isEditingName ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateName}>Save name</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setFirstName(originalFirstName); setLastName(originalLastName); setIsEditingName(false) }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input value={[firstName, lastName].filter(Boolean).join(" ") || "Not set"} disabled className="bg-muted" />
                <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditingEmail ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                  <Button variant="ghost" size="icon" onClick={() => { setEmail(originalEmail); setIsEditingEmail(false) }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateEmail}>Update email</Button>
                </div>
                <p className="text-xs text-muted-foreground">You may need to verify your new email address</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input id="email" type="email" value={email} disabled className="bg-muted" />
                <Button variant="ghost" size="icon" onClick={() => setIsEditingEmail(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            {isEditingUsername ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      placeholder="Enter your username"
                      className={
                        nameAvailable === false ? "border-red-500" : nameAvailable === true ? "border-green-500" : ""
                      }
                    />
                    {isCheckingName && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCancelUsernameEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {nameAvailable === false && <p className="text-sm text-red-500">This username is already taken</p>}
                {nameAvailable === true && <p className="text-sm text-green-500">This username is available</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input id="username-display" value={username} disabled className="bg-muted" />
                <Button variant="ghost" size="icon" onClick={() => setIsEditingUsername(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              For security reasons, we recommend using a strong password with at least 8 characters, including
              uppercase, lowercase, numbers, and special characters.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              variant="secondary"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            <CardTitle>Connected Accounts</CardTitle>
          </div>
          <CardDescription>Manage your linked social accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {connectedAccounts.length > 0 ? (
            connectedAccounts.map((account: any) => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {account.imageUrl && (
                    <img src={account.imageUrl} alt="" className="h-8 w-8 rounded-full" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">{account.provider || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{account.emailAddress || account.username || ""}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600/50">Connected</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No connected accounts</p>
          )}
          <Button variant="outline" size="sm" onClick={handleConnectGoogle} className="bg-transparent">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Connect Google
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <CardTitle>Active Sessions</CardTitle>
          </div>
          <CardDescription>Manage devices signed into your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions.length > 0 ? (
            activeSessions.map((session: any) => {
              const isCurrent = currentSession?.id === session.id
              const lastActive = session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleDateString("en-AU", {
                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
              }) : "Unknown"
              return (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {session.latestActivity?.deviceType || "Unknown device"}
                      </p>
                      {isCurrent && <Badge variant="outline" className="text-green-600 border-green-600/50 text-[10px]">Current</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last active: {lastActive}
                    </p>
                  </div>
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={isSigningOut === session.id}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      {isSigningOut === session.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <><LogOut className="h-3.5 w-3.5 mr-1" /> Sign out</>
                      )}
                    </Button>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No active sessions found</p>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{twoFactorEnabled ? "Enabled" : "Disabled"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {twoFactorEnabled
                  ? "Your account is protected with two-factor authentication"
                  : "Protect your account by requiring a second verification step"}
              </p>
            </div>
            <Badge variant={twoFactorEnabled ? "default" : "outline"} className={twoFactorEnabled ? "bg-green-600" : ""}>
              {twoFactorEnabled ? "On" : "Off"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            To {twoFactorEnabled ? "manage" : "enable"} two-factor authentication, use the Clerk account portal.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-transparent"
            onClick={() => clerk.openUserProfile({ appearance: { elements: { rootBox: { width: "100%" } } } })}
          >
            {twoFactorEnabled ? "Manage 2FA" : "Set up 2FA"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how RefZone looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label>Theme</Label>
            {mounted && (
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 ${theme !== "light" ? "bg-transparent" : ""}`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 ${theme !== "dark" ? "bg-transparent" : ""}`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className={`flex items-center gap-2 ${theme !== "system" ? "bg-transparent" : ""}`}
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Deleting your account is permanent and cannot be undone. All your data including scenarios, quizzes, forum
              posts, and progress will be permanently deleted.
            </AlertDescription>
          </Alert>

          {!showDeleteConfirm ? (
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">Are you absolutely sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting Account...
                    </>
                  ) : (
                    "Yes, Delete My Account"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isDeleting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="max-w-sm">
                <CardContent className="pt-6 flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-destructive" />
                  <div className="text-center">
                    <p className="font-semibold text-lg mb-1">Deleting Your Account</p>
                    <p className="text-sm text-muted-foreground">Please wait while we process your request...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
