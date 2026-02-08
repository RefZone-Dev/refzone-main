"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Pencil, Plus, Trash2, ArrowLeft, Target, FileQuestion, ShoppingBag, Sparkles } from "lucide-react"
import Link from "next/link"
import { VideoScenarioUpload } from "./video-scenarios"

interface Scenario {
  id: string
  title: string
  ai_description: string | null
  ai_answer: string | null
  difficulty: string
  scenario_type: string
  law_category: string | null
  video_url: string | null
  is_active: boolean
  points_value: number
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  is_active: boolean
  time_limit_minutes: number
}

interface ShopItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  rarity: string
  is_active: boolean
  item_data: any
}

interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: string
  options: any
  correct_answer: any
  explanation: string
  points_value: number
  law_category: string
  law_section: string
  order_index: number
}

export default function ContentManagement() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null)
  const [questionDialog, setQuestionDialog] = useState<{ open: boolean; editing: QuizQuestion | null }>({
    open: false,
    editing: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [scenarioDialog, setScenarioDialog] = useState<{ open: boolean; editing: Scenario | null }>({
    open: false,
    editing: null,
  })
  const [quizDialog, setQuizDialog] = useState<{ open: boolean; editing: Quiz | null }>({ open: false, editing: null })
  const [shopDialog, setShopDialog] = useState<{ open: boolean; editing: ShopItem | null }>({
    open: false,
    editing: null,
  })

  // Form states - Scenarios are now video-only and created via VideoScenarioUpload component

  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    time_limit_minutes: 10,
  })

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
    points_value: 10,
    law_category: "",
    law_section: "",
  })

  const [shopForm, setShopForm] = useState({
    name: "",
    description: "",
    category: "badge",
    price: 100,
    rarity: "common",
    item_data: {},
  })

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (!profile?.is_admin) {
        router.push("/dashboard")
        return
      }

      const [scenariosRes, quizzesRes, shopRes] = await Promise.all([
        supabase.from("scenarios").select("*").order("created_at", { ascending: false }),
        supabase.from("quizzes").select("*").order("created_at", { ascending: false }),
        supabase.from("shop_items").select("*").order("created_at", { ascending: false }),
      ])

      if (scenariosRes.data) setScenarios(scenariosRes.data)
      if (quizzesRes.data) setQuizzes(quizzesRes.data)
      if (shopRes.data) setShopItems(shopRes.data)

      setIsLoading(false)
    }

    fetchContent()
  }, [router])

  // Scenarios are now video-only and managed through VideoScenarioUpload component
  const refreshScenarios = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("scenarios").select("*").order("created_at", { ascending: false })
    if (data) setScenarios(data)
  }

  const deleteScenario = async (id: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Scenario",
      message:
        "Are you sure you want to delete this scenario? This will also delete all user responses. This action cannot be undone.",
      onConfirm: async () => {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        try {
          const response = await fetch(`/api/admin/delete-scenario?id=${id}`, {
            method: "DELETE",
            headers: {
              "x-user-id": user.id,
            },
          })

          const result = await response.json()

          if (!response.ok) {
            setModal({
              isOpen: true,
              type: "alert" as any,
              title: "Delete Failed",
              message: result.error || "Failed to delete scenario",
              onConfirm: () => setModal({ ...modal, isOpen: false }),
            })
            return
          }

          setScenarios(scenarios.filter((s) => s.id !== id))
          setModal({ ...modal, isOpen: false })
        } catch (error) {
          console.error("[v0] Delete scenario error:", error)
          setModal({
            isOpen: true,
            type: "alert" as any,
            title: "Delete Failed",
            message: "An unexpected error occurred",
            onConfirm: () => setModal({ ...modal, isOpen: false }),
          })
        }
      },
    })
  }

  const openQuizDialog = (quiz?: Quiz) => {
    if (quiz) {
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        time_limit_minutes: quiz.time_limit_minutes,
      })
      setQuizDialog({ open: true, editing: quiz })
    } else {
      setQuizForm({
        title: "",
        description: "",
        difficulty: "medium",
        time_limit_minutes: 10,
      })
      setQuizDialog({ open: true, editing: null })
    }
  }

  const saveQuiz = async () => {
    const supabase = createClient()

    if (quizDialog.editing) {
      const { error } = await supabase.from("quizzes").update(quizForm).eq("id", quizDialog.editing.id)

      if (!error) {
        setQuizzes(quizzes.map((q) => (q.id === quizDialog.editing!.id ? { ...q, ...quizForm } : q)))
      }
    } else {
      const { data, error } = await supabase
        .from("quizzes")
        .insert({ ...quizForm, is_active: true })
        .select()
        .single()

      if (data && !error) {
        setQuizzes([data, ...quizzes])
      }
    }

    setQuizDialog({ open: false, editing: null })
  }

  const deleteQuiz = async (id: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Quiz",
      message:
        "Are you sure you want to delete this quiz? This will also delete all questions and user attempts. This action cannot be undone.",
      onConfirm: async () => {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        try {
          const response = await fetch(`/api/admin/delete-quiz?id=${id}`, {
            method: "DELETE",
            headers: {
              "x-user-id": user.id,
            },
          })

          const result = await response.json()

          if (!response.ok) {
            setModal({
              isOpen: true,
              type: "alert" as any,
              title: "Delete Failed",
              message: result.error || "Failed to delete quiz",
              onConfirm: () => setModal({ ...modal, isOpen: false }),
            })
            return
          }

          setQuizzes(quizzes.filter((q) => q.id !== id))
          setModal({ ...modal, isOpen: false })
        } catch (error) {
          console.error("[v0] Delete quiz error:", error)
          setModal({
            isOpen: true,
            type: "alert" as any,
            title: "Delete Failed",
            message: "An unexpected error occurred",
            onConfirm: () => setModal({ ...modal, isOpen: false }),
          })
        }
      },
    })
  }

  const loadQuizQuestions = async (quizId: string) => {
    const supabase = createClient()
    const { data } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("order_index")

    setQuizQuestions(data || [])
    setEditingQuizId(quizId)
  }

  const openQuestionDialog = (question?: QuizQuestion) => {
    if (question) {
      setQuestionForm({
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options || ["", "", "", ""],
        correct_answer: question.correct_answer || 0,
        explanation: question.explanation,
        points_value: question.points_value,
        law_category: question.law_category,
        law_section: question.law_section,
      })
      setQuestionDialog({ open: true, editing: question })
    } else {
      setQuestionForm({
        question_text: "",
        question_type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
        points_value: 10,
        law_category: "",
        law_section: "",
      })
      setQuestionDialog({ open: true, editing: null })
    }
  }

  const saveQuestion = async () => {
    if (!editingQuizId) return
    const supabase = createClient()

    if (questionDialog.editing) {
      const { error } = await supabase
        .from("quiz_questions")
        .update({
          question_text: questionForm.question_text,
          question_type: questionForm.question_type,
          options: questionForm.options,
          correct_answer: questionForm.correct_answer,
          explanation: questionForm.explanation,
          points_value: questionForm.points_value,
          law_category: questionForm.law_category,
          law_section: questionForm.law_section,
        })
        .eq("id", questionDialog.editing.id)

      if (!error) {
        setQuizQuestions(
          quizQuestions.map((q) => (q.id === questionDialog.editing!.id ? { ...q, ...questionForm } : q)),
        )
      }
    } else {
      const { data, error } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: editingQuizId,
          ...questionForm,
          order_index: quizQuestions.length,
        })
        .select()
        .single()

      if (data && !error) {
        setQuizQuestions([...quizQuestions, data])
      }
    }

    setQuestionDialog({ open: false, editing: null })
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    const supabase = createClient()
    const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId)

    if (!error) {
      setQuizQuestions(quizQuestions.filter((q) => q.id !== questionId))
    }
  }

  const openShopDialog = (item?: ShopItem) => {
    if (item) {
      setShopForm({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        rarity: item.rarity,
        item_data: item.item_data || {},
      })
      setShopDialog({ open: true, editing: item })
    } else {
      setShopForm({
        name: "",
        description: "",
        category: "badge",
        price: 100,
        rarity: "common",
        item_data: {},
      })
      setShopDialog({ open: true, editing: null })
    }
  }

  const saveShopItem = async () => {
    const supabase = createClient()

    if (shopDialog.editing) {
      const { error } = await supabase.from("shop_items").update(shopForm).eq("id", shopDialog.editing.id)

      if (!error) {
        setShopItems(shopItems.map((s) => (s.id === shopDialog.editing!.id ? { ...s, ...shopForm } : s)))
      }
    } else {
      const { data, error } = await supabase
        .from("shop_items")
        .insert({ ...shopForm, is_active: true })
        .select()
        .single()

      if (data && !error) {
        setShopItems([data, ...shopItems])
      }
    }

    setShopDialog({ open: false, editing: null })
  }

  const deleteShopItem = async (id: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Shop Item",
      message: "Are you sure you want to delete this shop item? This action cannot be undone.",
      onConfirm: async () => {
        const supabase = createClient()
        await supabase.from("shop_items").delete().eq("id", id)
        setShopItems(shopItems.filter((s) => s.id !== id))
        setModal({ ...modal, isOpen: false })
      },
    })
  }

  const toggleScenarioActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient()
    await supabase.from("scenarios").update({ is_active: !currentActive }).eq("id", id)
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, is_active: !currentActive } : s)))
  }

  const toggleQuizActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient()
    await supabase.from("quizzes").update({ is_active: !currentActive }).eq("id", id)
    setQuizzes(quizzes.map((q) => (q.id === id ? { ...q, is_active: !currentActive } : q)))
  }

  const toggleShopItemActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient()
    await supabase.from("shop_items").update({ is_active: !currentActive }).eq("id", id)
    setShopItems(shopItems.map((s) => (s.id === id ? { ...s, is_active: !currentActive } : s)))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
      case "hard":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30"
      case "uncommon":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
      case "rare":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"
      case "epic":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30"
      case "legendary":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Modal for alerts and confirmations */}
      <Dialog open={modal.isOpen} onOpenChange={(open) => setModal({ ...modal, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal.title}</DialogTitle>
            <DialogDescription>{modal.message}</DialogDescription>
          </DialogHeader>
          {modal.type === "confirm" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal({ ...modal, isOpen: false })}>
                Cancel
              </Button>
              <Button onClick={modal.onConfirm}>Confirm</Button>
            </DialogFooter>
          )}
          {modal.type === "alert" && (
            <DialogFooter>
              <Button onClick={() => setModal({ ...modal, isOpen: false })}>Close</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Scenario Dialog - Video Upload */}
      <Dialog open={scenarioDialog.open} onOpenChange={(open) => setScenarioDialog({ open, editing: null })}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Video Scenario</DialogTitle>
            <DialogDescription>
              Upload a video and let AI analyze it to create a training scenario
            </DialogDescription>
          </DialogHeader>
          <VideoScenarioUpload 
            onSuccess={() => {
              setScenarioDialog({ open: false, editing: null })
              refreshScenarios()
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={quizDialog.open} onOpenChange={(open) => setQuizDialog({ open, editing: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{quizDialog.editing ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
            <DialogDescription>
              {quizDialog.editing ? "Update the quiz details below" : "Fill in the details to create a new quiz"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Title</Label>
              <Input
                id="quiz-title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="Enter quiz title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-description">Description</Label>
              <Textarea
                id="quiz-description"
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Describe the quiz"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-difficulty">Difficulty</Label>
                <Select
                  value={quizForm.difficulty}
                  onValueChange={(value) => setQuizForm({ ...quizForm, difficulty: value })}
                >
                  <SelectTrigger id="quiz-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-time-limit">Time Limit (minutes)</Label>
                <Input
                  id="quiz-time-limit"
                  type="number"
                  value={quizForm.time_limit_minutes}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, time_limit_minutes: Number.parseInt(e.target.value) || 10 })
                  }
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuizDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button onClick={saveQuiz} disabled={!quizForm.title || !quizForm.description}>
              {quizDialog.editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shop Item Dialog */}
      <Dialog open={shopDialog.open} onOpenChange={(open) => setShopDialog({ open, editing: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{shopDialog.editing ? "Edit Shop Item" : "Create Shop Item"}</DialogTitle>
            <DialogDescription>
              {shopDialog.editing
                ? "Update the shop item details below"
                : "Fill in the details to create a new shop item"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Name</Label>
              <Input
                id="shop-name"
                value={shopForm.name}
                onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-description">Description</Label>
              <Textarea
                id="shop-description"
                value={shopForm.description}
                onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                placeholder="Describe the item"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shop-category">Category</Label>
                <Select
                  value={shopForm.category}
                  onValueChange={(value) => setShopForm({ ...shopForm, category: value })}
                >
                  <SelectTrigger id="shop-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="avatar">Avatar</SelectItem>
                    <SelectItem value="theme">Theme</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop-rarity">Rarity</Label>
                <Select value={shopForm.rarity} onValueChange={(value) => setShopForm({ ...shopForm, rarity: value })}>
                  <SelectTrigger id="shop-rarity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-price">Price</Label>
              <Input
                id="shop-price"
                type="number"
                value={shopForm.price}
                onChange={(e) => setShopForm({ ...shopForm, price: Number.parseInt(e.target.value) || 100 })}
                placeholder="100"
                min="1"
              />
            </div>
            {/* Add more fields for item_data as needed */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShopDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button onClick={saveShopItem} disabled={!shopForm.name || !shopForm.description}>
              {shopDialog.editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingQuizId} onOpenChange={(open) => !open && setEditingQuizId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quiz Questions</DialogTitle>
            <DialogDescription>Manage questions for this quiz</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openQuestionDialog()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
            {quizQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No questions yet. Click "Add Question" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge variant="secondary">{question.law_category}</Badge>
                        </div>
                        <p className="font-medium">{question.question_text}</p>
                        <p className="text-sm text-muted-foreground mt-1">{question.points_value} points</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openQuestionDialog(question)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuizId(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={questionDialog.open} onOpenChange={(open) => setQuestionDialog({ open, editing: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{questionDialog.editing ? "Edit Question" : "Create Question"}</DialogTitle>
            <DialogDescription>Fill in the question details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={questionForm.question_text}
                onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                placeholder="Enter the question"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Law Category</Label>
                <Input
                  value={questionForm.law_category}
                  onChange={(e) => setQuestionForm({ ...questionForm, law_category: e.target.value })}
                  placeholder="e.g., Law 12"
                />
              </div>
              <div className="space-y-2">
                <Label>Law Section</Label>
                <Input
                  value={questionForm.law_section}
                  onChange={(e) => setQuestionForm({ ...questionForm, law_section: e.target.value })}
                  placeholder="e.g., Fouls and Misconduct"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Answer Options</Label>
              {questionForm.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionForm.options]
                      newOptions[index] = e.target.value
                      setQuestionForm({ ...questionForm, options: newOptions })
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Select
                value={questionForm.correct_answer.toString()}
                onValueChange={(value) => setQuestionForm({ ...questionForm, correct_answer: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionForm.options.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Option {index + 1}: {option || "(empty)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                placeholder="Explain why this is the correct answer"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Points Value</Label>
              <Input
                type="number"
                value={questionForm.points_value}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, points_value: Number.parseInt(e.target.value) || 10 })
                }
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button onClick={saveQuestion} disabled={!questionForm.question_text || !questionForm.law_category}>
              {questionDialog.editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <Button variant="outline" asChild className="cursor-pointer bg-transparent">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Content Management</h1>
        </div>
      </div>

      <Tabs defaultValue="scenarios">
        <TabsList>
          <TabsTrigger value="scenarios" className="cursor-pointer">
            <Target className="h-4 w-4 mr-2" />
            Scenarios ({scenarios.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="cursor-pointer">
            <FileQuestion className="h-4 w-4 mr-2" />
            Quizzes ({quizzes.length})
          </TabsTrigger>
          <TabsTrigger value="shop" className="cursor-pointer">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shop Items ({shopItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scenarios</CardTitle>
                  <CardDescription>Manage training scenarios</CardDescription>
                </div>
                <Button onClick={() => setScenarioDialog({ open: true, editing: null })} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Video Scenario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{scenario.title}</h3>
                          <Badge className={getDifficultyColor(scenario.difficulty)}>{scenario.difficulty}</Badge>
                          {!scenario.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{scenario.ai_answer || "No answer set"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{scenario.points_value} points</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleScenarioActive(scenario.id, scenario.is_active)}
                          className="cursor-pointer"
                        >
                          {scenario.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteScenario(scenario.id)}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quizzes</CardTitle>
                  <CardDescription>Manage knowledge quizzes</CardDescription>
                </div>
                <Button onClick={() => openQuizDialog()} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quiz
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{quiz.title}</h3>
                          <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                          {!quiz.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{quiz.time_limit_minutes} min time limit</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadQuizQuestions(quiz.id)}
                          className="cursor-pointer"
                        >
                          Questions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuizDialog(quiz)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleQuizActive(quiz.id, quiz.is_active)}
                          className="cursor-pointer"
                        >
                          {quiz.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuiz(quiz.id)}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop">
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shop Items</CardTitle>
                  <CardDescription>Manage purchasable items</CardDescription>
                </div>
                <Button onClick={() => openShopDialog()} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {shopItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                          {!item.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.price} points</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openShopDialog(item)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleShopItemActive(item.id, item.is_active)}
                          className="cursor-pointer"
                        >
                          {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteShopItem(item.id)}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
