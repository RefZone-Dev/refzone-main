"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, Flag, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  report_type: string
  match_details: any
  generated_report: string
  created_at: string
}

export default function MatchReportsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from("match_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setReports(data)
      }

      setIsLoading(false)
    }

    fetchReports()
  }, [router])

  const getReportIcon = (type: string) => {
    switch (type) {
      case "send_off":
        return AlertCircle
      case "incident":
        return FileText
      case "field":
        return Flag
      default:
        return FileText
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

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Match Report Builder</h1>
          <p className="text-muted-foreground">Generate and manage AI-powered match reports</p>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/match-reports/new/send-off">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Send-Off Report</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Generate formal reports for player dismissals with LOTG references</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/match-reports/new/incident">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Incident Report</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Document significant match incidents like mass confrontations or protests
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/match-reports/new/field">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Flag className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Field Report</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Report environmental, facility, or spectator issues at the venue</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Reports</CardTitle>
          <CardDescription>View and manage your previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading reports...</p>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No saved reports yet</p>
              <p className="text-sm text-muted-foreground">Create your first report using the cards above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const Icon = getReportIcon(report.report_type)
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {report.match_details?.home_team} vs {report.match_details?.away_team}
                          </h3>
                          <Badge className={getReportColor(report.report_type)} variant="outline">
                            {formatReportType(report.report_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="cursor-pointer bg-transparent">
                      <Link href={`/match-reports/${report.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
