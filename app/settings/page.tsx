"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Bell, Loader2, Info, Moon, Sun, Monitor, BadgeCheck, CheckCircle2, MessageSquare, ThumbsUp, User, Mail, Shield, AlertTriangle, Pencil, X, Phone, Calendar, ShieldCheck } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
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
  const [username, setUsername] = useState("")
  const [originalUsername, setOriginalUsername] = useState("")
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [originalDateOfBirth, setOriginalDateOfBirth] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("")
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneVerifyStep, setPhoneVerifyStep] = useState<"idle" | "sending" | "verify" | "verifying">("idle")
  const [phoneCode, setPhoneCode] = useState("")
  const [phoneVerifyError, setPhoneVerifyError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationRequested, setVerificationRequested] = useState(false)
  const [isRequestingVerification, setIsRequestingVerification] = useState(false)
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  const [settings, setSettings] = useState({
    newQuizNotifications: true,
    reminderNotifications: true,
    notifyForumReplies: true,
    notifyForumLikes: true,
    dailyNotificationTime: "17:00",
  })
  const [originalSettings, setOriginalSettings] = useState(settings)
  
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
    const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    const dobChanged = dateOfBirth !== originalDateOfBirth
    const phoneChanged = phoneNumber !== originalPhoneNumber
    setHasUnsavedChanges(usernameChanged || settingsChanged || dobChanged || phoneChanged)
  }, [username, originalUsername, isEditingUsername, settings, originalSettings, dateOfBirth, originalDateOfBirth, phoneNumber, originalPhoneNumber])

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

  useEffect(() => {
    const fetchUserAndSettings = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)
      setEmail(user.email || "")

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "display_name, weekly_quiz_notifications, reminder_notifications, is_verified, verification_requested, date_of_birth, phone_number, phone_verified",
        )
        .eq("id", user.id)
        .single()

      if (profile) {
        setUsername(profile.display_name || "")
        setOriginalUsername(profile.display_name || "")
        setDateOfBirth(profile.date_of_birth || "")
        setOriginalDateOfBirth(profile.date_of_birth || "")
        setPhoneNumber(profile.phone_number || "")
        setOriginalPhoneNumber(profile.phone_number || "")
        setPhoneVerified(profile.phone_verified || false)
        setIsVerified(profile.is_verified || false)
        setVerificationRequested(profile.verification_requested || false)
        const loadedSettings = {
          newQuizNotifications: profile.weekly_quiz_notifications ?? true,
          reminderNotifications: profile.reminder_notifications ?? true,
          notifyForumReplies: true,
          notifyForumLikes: true,
          dailyNotificationTime: "17:00",
        }
        setSettings(loadedSettings)
        setOriginalSettings(loadedSettings)
      }
    }

    fetchUserAndSettings()
  }, [router])

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
      } catch (error) {
        console.error("Error checking username:", error)
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

  const handleRequestVerification = async () => {
    if (!userId) return

    setIsRequestingVerification(true)

    try {
      const response = await fetch("/api/user/request-verification", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to request verification")
      }

      setVerificationRequested(true)
      showModal("success", "Verification Requested", "Your verification request has been submitted for review.")
    } catch (error) {
      console.error("Error requesting verification:", error)
      showModal("error", "Request Failed", "Failed to submit verification request. Please try again.")
    } finally {
      setIsRequestingVerification(false)
    }
  }

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
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      showModal("success", "Password Changed", "Your password has been changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error changing password:", error)
      showModal("error", "Password Change Failed", error.message || "Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
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
          weekly_quiz_notifications: settings.newQuizNotifications,
          reminder_notifications: settings.reminderNotifications,
      }
      if (dateOfBirth) updateData.date_of_birth = dateOfBirth
      if (phoneNumber !== originalPhoneNumber) updateData.phone_number = phoneNumber || null

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId)

      if (error) throw error

      setOriginalUsername(username)
      setOriginalDateOfBirth(dateOfBirth)
      setOriginalPhoneNumber(phoneNumber)
      setOriginalSettings(settings)
      setIsEditingUsername(false)
      setHasUnsavedChanges(false)
      showModal("success", "Settings Saved", "Your settings have been saved successfully!")
    } catch (error: any) {
      console.error("Error saving settings:", error)
      if (error.code === "23505") {
        showModal("error", "Username Taken", "This username is already in use. Please choose another.")
      } else {
        showModal("error", "Save Failed", "Failed to save settings. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSendPhoneCode = async () => {
    if (!phoneNumber.trim()) {
      setPhoneVerifyError("Please enter a phone number first.")
      return
    }
    setPhoneVerifyStep("sending")
    setPhoneVerifyError(null)
    try {
      const res = await fetch("/api/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPhoneVerifyError(data.error || "Failed to send code.")
        setPhoneVerifyStep("idle")
        return
      }
      setPhoneVerifyStep("verify")
      setResendCooldown(60)
    } catch {
      setPhoneVerifyError("An unexpected error occurred.")
      setPhoneVerifyStep("idle")
    }
  }

  const handleVerifyPhoneCode = async () => {
    if (phoneCode.length !== 6) {
      setPhoneVerifyError("Please enter the full 6-digit code.")
      return
    }
    setPhoneVerifyStep("verifying")
    setPhoneVerifyError(null)
    try {
      const res = await fetch("/api/phone/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: phoneCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPhoneVerifyError(data.error || "Verification failed.")
        setPhoneVerifyStep("verify")
        return
      }
      setPhoneVerified(true)
      setOriginalPhoneNumber(phoneNumber)
      setPhoneVerifyStep("idle")
      setPhoneCode("")
    } catch {
      setPhoneVerifyError("An unexpected error occurred.")
      setPhoneVerifyStep("verify")
    }
  }

  const handleDiscardChanges = () => {
    setUsername(originalUsername)
    setDateOfBirth(originalDateOfBirth)
    setPhoneNumber(originalPhoneNumber)
    setSettings(originalSettings)
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
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Error deleting account:", error)
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input id="email" type="email" value={email} disabled className="bg-muted" />
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="dob" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Collected for compliance with Australian law, including the Online Safety Amendment (Social Media Minimum Age) Act 2024.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
              {phoneVerified && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-normal">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </Label>

            {phoneVerifyStep === "verify" || phoneVerifyStep === "verifying" ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {"Enter the 6-digit code sent to "}
                  <span className="font-medium text-foreground">{phoneNumber}</span>
                </p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={phoneCode} onChange={setPhoneCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {phoneVerifyError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{phoneVerifyError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer bg-transparent"
                    onClick={() => { setPhoneVerifyStep("idle"); setPhoneCode(""); setPhoneVerifyError(null) }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleVerifyPhoneCode}
                    disabled={phoneVerifyStep === "verifying" || phoneCode.length !== 6}
                  >
                    {phoneVerifyStep === "verifying" ? (
                      <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Verifying...</>
                    ) : "Verify Code"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleSendPhoneCode}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      if (e.target.value !== originalPhoneNumber) setPhoneVerified(false)
                    }}
                    placeholder="e.g. 0412 345 678"
                    className="flex-1"
                  />
                  {phoneNumber.trim() && !phoneVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer bg-transparent shrink-0"
                      onClick={handleSendPhoneCode}
                      disabled={phoneVerifyStep === "sending"}
                    >
                      {phoneVerifyStep === "sending" ? (
                        <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Sending...</>
                      ) : "Verify"}
                    </Button>
                  )}
                </div>
                {phoneVerifyError && phoneVerifyStep === "idle" && (
                  <p className="text-sm text-red-600 dark:text-red-400">{phoneVerifyError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Used for account recovery if you forget your password. {!phoneVerified && phoneNumber.trim() ? "Please verify your number." : ""}
                </p>
              </>
            )}
          </div>

          <div className="pt-4 border-t">
            {isVerified ? (
              <div className="flex items-center gap-2 text-blue-500">
                <BadgeCheck className="h-5 w-5" />
                <div>
                  <p className="font-medium">RefZone Staff</p>
                  <p className="text-sm text-muted-foreground">You are a verified RefZone staff member</p>
                </div>
              </div>
            ) : verificationRequested ? (
              <div className="flex items-center gap-2 text-amber-500">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-medium">Staff Verification Pending</p>
                  <p className="text-sm text-muted-foreground">Your staff verification request is under review</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Staff Verification</p>
                    <p className="text-sm text-muted-foreground">
                      The blue checkmark is reserved for RefZone staff members only
                    </p>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Only apply for verification if you are a member of the RefZone team. This badge indicates official staff, not general user verification.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleRequestVerification} disabled={isRequestingVerification} size="sm" variant="outline" className="bg-transparent">
                  {isRequestingVerification ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    "Request Staff Verification"
                  )}
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
          {mounted && theme === "dark" && (
            <p className="text-sm text-muted-foreground italic mt-2">Dark mode for Liam</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>Choose what notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Notification preferences are stored for future use. Email notifications will be implemented in an upcoming
              release.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-quiz">New Quiz Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when a new quiz is created</p>
            </div>
            <Switch
              id="new-quiz"
              checked={settings.newQuizNotifications}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, newQuizNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Training Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminders to complete your daily training</p>
            </div>
            <Switch
              id="reminders"
              checked={settings.reminderNotifications}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, reminderNotifications: checked }))}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Forum Notifications
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-replies">Reply Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone replies to your posts</p>
                </div>
                <Switch
                  id="notify-replies"
                  checked={settings.notifyForumReplies}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifyForumReplies: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="notify-likes">Like Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified when someone likes your posts</p>
                </div>
                <Switch
                  id="notify-likes"
                  checked={settings.notifyForumLikes}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifyForumLikes: checked }))}
                />
              </div>
            </div>
          </div>

          {settings.reminderNotifications && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="notification-time">Reminder Time</Label>
                <p className="text-sm text-muted-foreground mb-2">When would you like to receive training reminders?</p>
                <Select
                  value={settings.dailyNotificationTime}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, dailyNotificationTime: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
