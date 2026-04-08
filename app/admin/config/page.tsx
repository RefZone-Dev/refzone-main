"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth, useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Save, Loader2, Wand2, Sparkles, BookOpen, Upload, FileText, Check } from "lucide-react"
import Link from "next/link"
import { CustomModal } from "@/components/custom-modal"

interface Config {
  config_key: string
  config_value: string
  description: string | null
}

export default function AdminConfigPage() {
  const { userId } = useAuth()
  const { user: clerkUser } = useUser()
  const [configs, setConfigs] = useState<Config[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const router = useRouter()

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
  })

  const showModal = (type: "success" | "error" | "warning" | "info" | "confirm", title: string, message: string) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
    })
  }

  useEffect(() => {
    const fetchConfig = async () => {
      if (!userId) {
        router.push("/auth/login")
        return
      }

      const email = clerkUser?.primaryEmailAddress?.emailAddress
      const adminEmails = ["henrytowen@googlemail.com", "refzone.office@gmail.com"]
      if (!email || !adminEmails.includes(email)) {
        router.push("/dashboard")
        return
      }

      const supabase = createClient()

      const { data } = await supabase.from("admin_config").select("*").order("config_key")

      if (data) {
        // Filter out daily_scenario_prompt
        const filteredData = data.filter(c => c.config_key !== "daily_scenario_prompt")
        const sortedConfigs = filteredData.sort((a, b) => {
          if (a.config_key === "laws_of_the_game_document") return 1
          if (b.config_key === "laws_of_the_game_document") return -1
          return a.config_key.localeCompare(b.config_key)
        })
        setConfigs(sortedConfigs)
      }

      setIsLoading(false)
    }

    fetchConfig()
  }, [router, clerkUser])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const supabase = createClient()

      for (const config of configs) {
        await supabase
          .from("admin_config")
          .update({
            config_value: config.config_value,
            updated_at: new Date().toISOString(),
          })
          .eq("config_key", config.config_key)
      }

      showModal("success", "Configuration Saved", "Configuration has been saved successfully!")
    } catch (error) {
      showModal("error", "Save Failed", "Failed to save configuration. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfigChange = (key: string, value: string) => {
    setConfigs(configs.map((c) => (c.config_key === key ? { ...c, config_value: value } : c)))
  }

  const handleGenerateScenario = async () => {
    setIsGeneratingScenario(true)
    try {
      const response = await fetch("/api/admin/generate-scenario", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showModal("success", "Scenario Generated", "Successfully created new scenario!")
      } else {
        const errorDetails = result.details ? `\n\nDetails: ${result.details}` : ""
        showModal("error", "Generation Failed", (result.error || "Failed to generate scenario") + errorDetails)
      }
    } catch (error) {
      showModal(
        "error",
        "Generation Failed",
        `Failed to generate scenario: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      setIsGeneratingScenario(false)
    }
  }

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true)
    try {
      const response = await fetch("/api/admin/generate-quiz", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showModal("success", "Quiz Generated", "Successfully created new quiz!")
      } else {
        const errorDetails = result.details ? `\n\nDetails: ${result.details}` : ""
        showModal("error", "Generation Failed", (result.error || "Failed to generate quiz") + errorDetails)
      }
    } catch (error) {
      showModal(
        "error",
        "Generation Failed",
        `Failed to generate quiz: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  const handleTextFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Accept text files only
    if (!file.name.endsWith(".txt") && file.type !== "text/plain") {
      showModal(
        "error",
        "Invalid File Type",
        "Please upload a .txt text file. For PDFs, copy the text content and paste it directly into the text area below.",
      )
      return
    }

    setIsUploadingFile(true)
    setUploadedFileName(file.name)

    try {
      const text = await file.text()

      if (!text || text.trim().length === 0) {
        showModal("error", "Empty File", "The uploaded file appears to be empty.")
        setUploadedFileName(null)
        setIsUploadingFile(false)
        return
      }

      // Update the config in state
      setConfigs(
        configs.map((c) => (c.config_key === "laws_of_the_game_document" ? { ...c, config_value: text.trim() } : c)),
      )

      showModal(
        "success",
        "File Loaded",
        `Loaded ${text.length.toLocaleString()} characters from ${file.name}. Click "Save All Changes" to persist.`,
      )
    } catch (error) {
      showModal("error", "Upload Failed", "Failed to read file. Please try again.")
      setUploadedFileName(null)
    } finally {
      setIsUploadingFile(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getConfigIcon = (key: string) => {
    if (key === "laws_of_the_game_document") return <BookOpen className="h-5 w-5 text-primary" />
    return <Wand2 className="h-5 w-5 text-primary" />
  }

  const getTextareaRows = (key: string) => {
    if (key === "laws_of_the_game_document") return 20
    return 6
  }

  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6 max-w-4xl">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild className="cursor-pointer bg-transparent">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">AI Configuration</h1>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="cursor-pointer">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading configuration...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {configs.map((config) => (
            <Card
              key={config.config_key}
              className={config.config_key === "laws_of_the_game_document" ? "border-primary/30" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getConfigIcon(config.config_key)}
                    <CardTitle className="capitalize">{config.config_key.replace(/_/g, " ")}</CardTitle>
                  </div>
                  {config.config_key === "laws_of_the_game_document" && (
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,text/plain"
                        onChange={handleTextFileUpload}
                        className="hidden"
                        id="lotg-file-upload"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        {isUploadingFile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload .txt File
                          </>
                        )}
                      </Button>
                      {uploadedFileName && !isUploadingFile && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Check className="h-4 w-4 text-green-500" />
                          {uploadedFileName}
                        </span>
                      )}
                    </div>
                  )}
                  {config.config_key === "daily_scenario_prompt" && (
                    <Button
                      onClick={handleGenerateScenario}
                      disabled={isGeneratingScenario}
                      size="sm"
                      className="cursor-pointer"
                    >
                      {isGeneratingScenario ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Now
                        </>
                      )}
                    </Button>
                  )}
                  {config.config_key === "weekly_quiz_prompt" && (
                    <Button
                      onClick={handleGenerateQuiz}
                      disabled={isGeneratingQuiz}
                      size="sm"
                      className="cursor-pointer"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Now
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {config.description && <CardDescription>{config.description}</CardDescription>}
                {config.config_key === "laws_of_the_game_document" && (
                  <div className="space-y-2 mt-2">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Paste the Laws of the Game text content below, or upload a .txt file. For PDFs, please copy the
                      text and paste it directly.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Accepts: Plain text paste or .txt file upload</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={config.config_key}>
                    {config.config_key === "laws_of_the_game_document"
                      ? "Laws of the Game Document Content"
                      : "Prompt Configuration"}
                  </Label>
                  <Textarea
                    id={config.config_key}
                    value={config.config_value}
                    onChange={(e) => handleConfigChange(config.config_key, e.target.value)}
                    rows={getTextareaRows(config.config_key)}
                    className="font-mono text-sm"
                    placeholder={
                      config.config_key === "laws_of_the_game_document"
                        ? "Paste the Laws of the Game text content here, or upload a .txt file..."
                        : ""
                    }
                  />
                  {config.config_key === "laws_of_the_game_document" && config.config_value && (
                    <p className="text-xs text-muted-foreground text-right">
                      {config.config_value.length.toLocaleString()} characters
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
