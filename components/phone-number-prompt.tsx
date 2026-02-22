"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, X, Shield, CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function PhoneNumberPrompt() {
  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [step, setStep] = useState<"phone" | "verify" | "success">("phone")
  const [code, setCode] = useState("")
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Phone prompt disabled - feature removed
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [resendCooldown])

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number.")
      return
    }

    setSending(true)
    setError(null)

    try {
      const res = await fetch("/api/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send code.")
        setSending(false)
        return
      }

      setStep("verify")
      setResendCooldown(60)
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setSending(false)
    }
  }

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/phone/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Verification failed.")
        setSaving(false)
        return
      }

      setStep("success")
      setTimeout(() => setOpen(false), 2000)
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase
        .from("profiles")
        .update({ phone_prompt_shown: true })
        .eq("id", session.user.id)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleSkip() }}>
      <DialogContent className="sm:max-w-md">
        {step === "phone" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Add Your Phone Number
              </DialogTitle>
              <DialogDescription>
                Adding a phone number helps you recover your account if you forget your password. We will send a verification code to confirm your number.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your phone number is stored securely and will only be used for account recovery purposes.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone-prompt">Phone Number</Label>
                <Input
                  id="phone-prompt"
                  type="tel"
                  placeholder="e.g. 0412 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer bg-transparent"
                  onClick={handleSkip}
                >
                  <X className="h-4 w-4 mr-2" />
                  Skip
                </Button>
                <Button
                  className="flex-1 cursor-pointer"
                  onClick={handleSendCode}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verify Your Phone Number
              </DialogTitle>
              <DialogDescription>
                {"We've sent a 6-digit verification code to "}
                <span className="font-medium text-foreground">{phoneNumber}</span>
                . Enter the code below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
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

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              )}

              <Button
                className="w-full cursor-pointer"
                onClick={handleVerifyCode}
                disabled={saving || code.length !== 6}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setCode(""); setError(null) }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={resendCooldown > 0 || sending}
                  className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Phone Number Verified</h3>
              <p className="text-sm text-muted-foreground mt-1">Your phone number has been saved for account recovery.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
