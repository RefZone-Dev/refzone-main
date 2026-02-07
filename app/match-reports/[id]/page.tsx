"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, Trash2, Loader2, FileText, AlertCircle, Flag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CustomModal } from "@/components/custom-modal"

interface Report {
  id: string
  report_type: string
  match_details: Record<string, string>
  incident_details: string
  generated_report: string
  created_at: string
  updated_at: string
}

export default function ViewReportPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    if (params instanceof Promise) {
      params.then((p) => setReportId(p.id))
    } else {
      setReportId(params.id)
    }
  }, [params])

  if (!reportId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <ReportViewer reportId={reportId} />
}

function ReportViewer({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error" | "warning" | "info" | "confirm">("info")
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  const showModal = (type: typeof modalType, title: string, message: string, onConfirm?: () => void) => {
    setModalType(type)
    setModalTitle(title)
    setModalMessage(message)
    setConfirmAction(onConfirm ? () => onConfirm : null)
    setModalOpen(true)
  }

  useEffect(() => {
    const fetchReport = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("match_reports")
        .select("*")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setReport(data)
      }
      setIsLoading(false)
    }

    fetchReport()
  }, [reportId, router])

  const handleCopy = () => {
    if (!report) return
    navigator.clipboard.writeText(report.generated_report)
    showModal("success", "Copied", "Report copied to clipboard.")
  }

  const handleDownload = () => {
    if (!report) return
    const blob = new Blob([report.generated_report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.report_type}-report-${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showModal("success", "Downloaded", "Report downloaded successfully.")
  }

  const handleDelete = () => {
    showModal("confirm", "Delete Report", "Are you sure you want to delete this report? This action cannot be undone.", async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from("match_reports")
        .delete()
        .eq("id", reportId)

      if (error) {
        showModal("error", "Delete Failed", "Failed to delete report. Please try again.")
      } else {
        router.push("/match-reports")
      }
    })
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "send_off":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "incident":
        return <FileText className="h-5 w-5 text-orange-600" />
      case "field":
        return <Flag className="h-5 w-5 text-blue-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getReportColor = (type: string) => {
    switch (type) {
      case "send_off":
        return "bg-red-100 text-red-700 border-red-200"
      case "incident":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "field":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const formatReportType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      playerNumber: "Player Number",
      team: "Team",
      minuteOfIncident: "Minute",
      typeOfOffence: "Offence Type",
      locationOnField: "Location",
      decisionMade: "Decision",
      description: "Description",
      incidentType: "Incident Type",
      location: "Location",
      playersInvolved: "Players Involved",
      whatInitiated: "What Initiated",
      actionsTaken: "Actions Taken",
      issueType: "Issue Type",
      minuteOccurred: "Minute Occurred",
      actionTaken: "Action Taken",
      matchProceeded: "Match Proceeded",
      delayMinutes: "Delay (minutes)",
    }
    return labels[key] || key
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/match-reports">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground">This report may have been deleted or you don{"'"}t have access to it.</p>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CustomModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setConfirmAction(null)
        }}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onConfirm={confirmAction || undefined}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/match-reports">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {getReportIcon(report.report_type)}
            <h1 className="text-2xl font-bold">{formatReportType(report.report_type)} Report</h1>
          </div>
        </div>
        <Badge className={getReportColor(report.report_type)} variant="outline">
          {formatReportType(report.report_type)}
        </Badge>
      </div>

      {/* Report metadata */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(report.match_details).map(([key, value]) => {
              if (!value || value === "") return null
              return (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {getFieldLabel(key)}
                  </span>
                  <span className="text-sm mt-0.5">{String(value)}</span>
                </div>
              )
            })}
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</span>
              <span className="text-sm mt-0.5">
                {new Date(report.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated report */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Generated Report</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">{report.generated_report}</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-600">Delete this report</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDelete} className="bg-transparent text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
