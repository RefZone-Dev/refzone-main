"use client"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Download, Save, FileText, Loader2, Edit3 } from "lucide-react"
import Link from "next/link"
import { CustomModal } from "@/components/custom-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Wrapper to handle async params
export default function NewReportPage({ params }: { params: { type: string } | Promise<{ type: string }> }) {
  const [reportType, setReportType] = useState<"send-off" | "incident" | "field" | null>(null)

  useEffect(() => {
    // Check if params is a Promise or a regular object
    if (params instanceof Promise) {
      params.then((p) => setReportType(p.type as "send-off" | "incident" | "field"))
    } else {
      setReportType(params.type as "send-off" | "incident" | "field")
    }
  }, [params])

  if (!reportType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <ReportForm reportType={reportType} />
}

function ReportForm({ reportType }: { reportType: "send-off" | "incident" | "field" }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showEditHint, setShowEditHint] = useState(true)
  const reportRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error" | "warning" | "info" | "confirm">("info")
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const showModal = (type: typeof modalType, title: string, message: string) => {
    setModalType(type)
    setModalTitle(title)
    setModalMessage(message)
    setModalOpen(true)
  }

  const [sendOffFields, setSendOffFields] = useState({
    playerNumber: "",
    team: "home",
    minuteOfIncident: "",
    typeOfOffence: "",
    locationOnField: "",
    decisionMade: "",
    description: "",
  })

  const [incidentFields, setIncidentFields] = useState({
    incidentType: "",
    minuteOfIncident: "",
    location: "",
    playersInvolved: "",
    whatInitiated: "",
    actionsTaken: "",
  })

  const [fieldFields, setFieldFields] = useState({
    issueType: "",
    minuteOccurred: "",
    actionTaken: "",
    matchProceeded: "yes",
    delayMinutes: "", // Only shown when matchProceeded is "delayed"
  })

  const buildPromptContext = () => {
    let context = ""

    if (reportType === "send-off") {
      context = `SEND-OFF DETAILS:
Player Number: ${sendOffFields.playerNumber}
Team: ${sendOffFields.team}
Minute: ${sendOffFields.minuteOfIncident}'
Offence Type: ${sendOffFields.typeOfOffence}
Location: ${sendOffFields.locationOnField}
Decision: ${sendOffFields.decisionMade}
Description: ${sendOffFields.description}
`
    } else if (reportType === "incident") {
      context = `INCIDENT DETAILS:
Type: ${incidentFields.incidentType}
Minute: ${incidentFields.minuteOfIncident}'
Location: ${incidentFields.location}
Players Involved: ${incidentFields.playersInvolved}
What Initiated: ${incidentFields.whatInitiated}
Actions Taken: ${incidentFields.actionsTaken}
`
    } else if (reportType === "field") {
      context = `FIELD REPORT DETAILS:
Issue Type: ${fieldFields.issueType}
Minute: ${fieldFields.minuteOccurred}'
Action Taken: ${fieldFields.actionTaken}
Match Proceeded: ${fieldFields.matchProceeded}
${fieldFields.matchProceeded === "delayed" && fieldFields.delayMinutes ? `Delayed by: ${fieldFields.delayMinutes} minutes` : ""}
`
    }

    return context
  }

  const getReportPrompt = () => {
    const context = buildPromptContext()

    const baseRules = `IMPORTANT RULES:
- Only use the information provided below. DO NOT invent or assume any details not given.
- Write in plain text only - no formatting, headers, bullet points, or markdown.
- Be concise and proportional to the amount of detail provided. If only a few details were given, write only 2-4 sentences. If more detail was given, write up to 1-2 short paragraphs maximum.
- NEVER pad or bulk up the report with filler language. Every sentence must add factual value.
- Use formal, professional language suitable for submission to competition authorities.
- If information is missing, just don't mention it - don't fill in gaps.
- If the provided details are too vague or insufficient to write a meaningful report (e.g. just one or two very short words with no real context), respond ONLY with: "NEED_MORE_INFO: " followed by a brief question asking for clarification. For example: "NEED_MORE_INFO: Could you provide more details about what occurred, including the type of offence and the minute it happened?"`

    switch (reportType) {
      case "send-off":
        return `You are helping a football referee write a formal send-off report. Write from the referee's first-person perspective (using "I").

${baseRules}

${context}

Write the report now:`

      case "incident":
        return `You are helping a football referee write a formal incident report. Write from the referee's first-person perspective (using "I").

${baseRules}

${context}

Write the report now:`

      case "field":
        return `You are helping a football referee write a formal field/pitch report. Write from the referee's first-person perspective (using "I").

${baseRules}

${context}

Write the report now:`

      default:
        return context
    }
  }

  const handleGenerate = async () => {
    // Validate required fields
    if (reportType === "send-off") {
      if (
        !sendOffFields.playerNumber ||
        !sendOffFields.minuteOfIncident ||
        !sendOffFields.typeOfOffence ||
        !sendOffFields.decisionMade ||
        !sendOffFields.description
      ) {
        showModal(
          "warning",
          "Missing Fields",
          "Please fill in all required fields (Player Number, Minute, Offence Type, Decision, Description).",
        )
        return
      }
    } else if (reportType === "incident") {
      if (!incidentFields.incidentType || !incidentFields.minuteOfIncident || !incidentFields.actionsTaken) {
        showModal(
          "warning",
          "Missing Fields",
          "Please fill in all required fields (Incident Type, Minute, Actions Taken).",
        )
        return
      }
    } else if (reportType === "field") {
      if (!fieldFields.issueType || !fieldFields.actionTaken) {
        showModal("warning", "Missing Fields", "Please fill in all required fields (Issue Type, Action Taken).")
        return
      }
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: getReportPrompt(),
        }),
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Check if AI is asking for more info
      if (data.report && data.report.startsWith("NEED_MORE_INFO:")) {
        const followUpQuestion = data.report.replace("NEED_MORE_INFO:", "").trim()
        showModal("info", "More Details Needed", followUpQuestion)
        setIsGenerating(false)
        return
      }
      
      setGeneratedReport(data.report)
      setShowEditHint(true)
      // Scroll to report after a short delay to allow render
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (error) {
      console.error("[v0] Error generating report:", error)
      showModal("error", "Generation Failed", "Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport)
    showModal("success", "Copied", "Report copied to clipboard.")
  }

  const handleDownload = () => {
    const blob = new Blob([generatedReport], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showModal("success", "Downloaded", "Report downloaded successfully.")
  }

  const handleSaveReport = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Convert report type to database format (replace dash with underscore)
      const dbReportType = reportType.replace("-", "_")
      
      // Build incident_details string based on report type
      let incidentDetailsText = ""
      if (reportType === "send-off") {
        incidentDetailsText = sendOffFields.description || "Send-off report"
      } else if (reportType === "incident") {
        incidentDetailsText = incidentFields.whatInitiated || "Incident report"
      } else if (reportType === "field") {
        incidentDetailsText = fieldFields.actionTaken || "Field report"
      }

      const { data: inserted, error } = await supabase.from("match_reports").insert({
        user_id: user.id,
        report_type: dbReportType,
        generated_report: generatedReport,
        match_details:
          reportType === "send-off" ? sendOffFields : reportType === "incident" ? incidentFields : fieldFields,
        incident_details: incidentDetailsText,
      }).select("id").single()

      if (error) throw error
      
      if (inserted?.id) {
        window.location.href = `/match-reports/${inserted.id}`
      } else {
        showModal("success", "Saved", "Report saved to your account.")
      }
    } catch (error) {
      console.error("[v0] Error saving report:", error)
      showModal("error", "Save Failed", "Failed to save report. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const getTitle = () => {
    switch (reportType) {
      case "send-off":
        return "Send-Off Report"
      case "incident":
        return "Incident Report"
      case "field":
        return "Field Report"
      default:
        return "Report"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />

      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/match-reports">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
      </div>

      <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Fill in the details below. AI will generate a concise professional report from your perspective as the
            referee.
          </p>
        </CardContent>
      </Card>

      {/* Send-Off Form */}
      {reportType === "send-off" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Send-Off Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="playerNumber">Player Number *</Label>
              <Input
                id="playerNumber"
                placeholder="e.g. 10"
                required
                value={sendOffFields.playerNumber}
                onChange={(e) => setSendOffFields({ ...sendOffFields, playerNumber: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team">Team *</Label>
              <Select value={sendOffFields.team} onValueChange={(v) => setSendOffFields({ ...sendOffFields, team: v })}>
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="away">Away</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minute">Minute of Incident *</Label>
              <Input
                id="minute"
                type="text"
                placeholder="e.g. 45, Pre-match, Half-time"
                required
                value={sendOffFields.minuteOfIncident}
                onChange={(e) => setSendOffFields({ ...sendOffFields, minuteOfIncident: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="offence">Type of Offence *</Label>
              <Input
                id="offence"
                placeholder="e.g. Violent conduct, Serious foul play"
                required
                value={sendOffFields.typeOfOffence}
                onChange={(e) => setSendOffFields({ ...sendOffFields, typeOfOffence: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="location">Location on Field *</Label>
              <Input
                id="location"
                placeholder="e.g. Center circle, Penalty area"
                required
                value={sendOffFields.locationOnField}
                onChange={(e) => setSendOffFields({ ...sendOffFields, locationOnField: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="decision">Decision Made *</Label>
              <Input
                id="decision"
                placeholder="e.g. Send-off (Red Card)"
                required
                value={sendOffFields.decisionMade}
                onChange={(e) => setSendOffFields({ ...sendOffFields, decisionMade: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description of Incident *</Label>
              <Textarea
                id="description"
                placeholder="Describe what occurred. Player #{playerNumber} ({team} team)..."
                value={sendOffFields.description}
                onChange={(e) => setSendOffFields({ ...sendOffFields, description: e.target.value })}
                rows={4}
                required
                className="text-base min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Identify the player by number and team (e.g., "Player #7 from the home team struck an opponent with
                excessive force")
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incident Form */}
      {reportType === "incident" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="incidentType">Incident Type *</Label>
              <Input
                id="incidentType"
                placeholder="e.g. Mass confrontation, Spectator incident"
                required
                value={incidentFields.incidentType}
                onChange={(e) => setIncidentFields({ ...incidentFields, incidentType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="incidentMinute">Minute of Incident *</Label>
              <Input
                id="incidentMinute"
                type="text"
                placeholder="e.g. 67, Pre-match, Half-time"
                required
                value={incidentFields.minuteOfIncident}
                onChange={(e) => setIncidentFields({ ...incidentFields, minuteOfIncident: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="incidentLocation">Location</Label>
              <Input
                id="incidentLocation"
                placeholder="e.g. Technical area, Behind goal"
                value={incidentFields.location}
                onChange={(e) => setIncidentFields({ ...incidentFields, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="playersInvolved">Players/Persons Involved</Label>
              <Input
                id="playersInvolved"
                placeholder="e.g. #7 Home, #14 Away"
                value={incidentFields.playersInvolved}
                onChange={(e) => setIncidentFields({ ...incidentFields, playersInvolved: e.target.value })}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="whatInitiated">What Initiated the Incident</Label>
              <Textarea
                id="whatInitiated"
                placeholder="Describe what started the incident..."
                value={incidentFields.whatInitiated}
                onChange={(e) => setIncidentFields({ ...incidentFields, whatInitiated: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="actionsTaken">Actions Taken *</Label>
              <Textarea
                id="actionsTaken"
                placeholder="Describe what you did in response..."
                required
                value={incidentFields.actionsTaken}
                onChange={(e) => setIncidentFields({ ...incidentFields, actionsTaken: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Report Form */}
      {reportType === "field" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Field Report Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="issueType">Issue Type *</Label>
              <Input
                id="issueType"
                placeholder="e.g. Unsafe goalposts, Pitch damage"
                required
                value={fieldFields.issueType}
                onChange={(e) => setFieldFields({ ...fieldFields, issueType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fieldMinute">Minute Occurred</Label>
              <Input
                id="fieldMinute"
                type="text"
                placeholder="e.g. Pre-match, 30, Half-time"
                value={fieldFields.minuteOccurred}
                onChange={(e) => setFieldFields({ ...fieldFields, minuteOccurred: e.target.value })}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="actionTaken">Action Taken *</Label>
              <Textarea
                id="actionTaken"
                placeholder="Describe what action you took..."
                required
                value={fieldFields.actionTaken}
                onChange={(e) => setFieldFields({ ...fieldFields, actionTaken: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="matchProceeded">Match Proceeded *</Label>
              <Select
                value={fieldFields.matchProceeded}
                onValueChange={(v) => setFieldFields({ ...fieldFields, matchProceeded: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No - Abandoned</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fieldFields.matchProceeded === "delayed" && (
              <div className="grid gap-2">
                <Label htmlFor="delayMinutes">Delay Duration (minutes)</Label>
                <Input
                  id="delayMinutes"
                  type="number"
                  placeholder="e.g. 15"
                  value={fieldFields.delayMinutes}
                  onChange={(e) => setFieldFields({ ...fieldFields, delayMinutes: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generate Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card ref={reportRef}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle>Generated Report</CardTitle>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 sm:flex-none bg-transparent">
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
                <Button size="sm" onClick={handleSaveReport} disabled={isSaving} className="flex-1 sm:flex-none">
                  <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showEditHint && (
              <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Edit3 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 dark:text-blue-300 flex items-center justify-between">
                  <span>You can edit this report text directly before saving or copying.</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditHint(false)}
                    className="text-blue-600 hover:text-blue-800 -mr-2"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <Textarea
              value={generatedReport}
              onChange={(e) => setGeneratedReport(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
