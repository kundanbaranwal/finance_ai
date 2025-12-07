import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockBudgets } from "@/lib/mock-data";
import {
  Budget,
  TransactionCategory,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
} from "@/types/finance";
import { Plus, Edit2, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  useBudgets,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/hooks/useApi";

export default function Budgets() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [newBudget, setNewBudget] = useState({
    category: "food" as TransactionCategory | "total",
    amount: "",
  });

  const { data: budgetsData, isLoading } = useBudgets();
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  const { toast } = useToast();

  // Use real data if available, fallback to mock
  const budgets = budgetsData?.data || mockBudgets;

  const getStatus = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return "over";
    if (percentage >= 80) return "warning";
    return "normal";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newBudget.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid budget amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingBudget) {
        await updateBudgetMutation.mutateAsync({
          id: editingBudget.id,
          data: { limit: amount },
        });
        toast({
          title: "Budget updated",
          description: "Your budget has been updated successfully.",
        });
      } else {
        const currentMonth = new Date().toISOString().slice(0, 7);
        await createBudgetMutation.mutateAsync({
          category: newBudget.category,
          limit: amount,
          month: currentMonth,
        });
        toast({
          title: "Budget created",
          description: "Your new budget has been created.",
        });
      }

      setIsDialogOpen(false);
      setEditingBudget(null);
      setNewBudget({ category: "food", amount: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save budget",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (budget: any) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      amount: budget.limit?.toString() || budget.amount?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const totalBudget = budgets.find((b: any) => b.category === "total");
  const categoryBudgets = budgets.filter((b: any) => b.category !== "total");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Budgets</h1>
            <p className="text-muted-foreground">
              Set and track your spending limits
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingBudget(null);
                setNewBudget({ category: "food", amount: "" });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="glow">
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? "Edit Budget" : "Create New Budget"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveBudget} className="space-y-4">
                {!editingBudget && (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newBudget.category}
                      onValueChange={(value) =>
                        setNewBudget({
                          ...newBudget,
                          category: value as TransactionCategory | "total",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">
                          <span className="flex items-center gap-2">
                            <span>💰</span>
                            <span>Total Budget</span>
                          </span>
                        </SelectItem>
                        {Object.entries(CATEGORY_LABELS)
                          .filter(([key]) => key !== "income")
                          .map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              <span className="flex items-center gap-2">
                                <span>
                                  {CATEGORY_ICONS[value as TransactionCategory]}
                                </span>
                                <span>{label}</span>
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Monthly Budget Amount</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter amount"
                    value={newBudget.amount}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingBudget ? "Update Budget" : "Create Budget"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Budget Card */}
        {totalBudget && (
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Budget
                    </p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(totalBudget.amount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(totalBudget.spent)}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {formatCurrency(totalBudget.amount - totalBudget.spent)}{" "}
                    remaining
                  </span>
                  <span>
                    {((totalBudget.spent / totalBudget.amount) * 100).toFixed(
                      0
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    (totalBudget.spent / totalBudget.amount) * 100,
                    100
                  )}
                  className={cn(
                    "h-3",
                    getStatus(totalBudget.spent, totalBudget.amount) ===
                      "normal" && "[&>div]:bg-primary",
                    getStatus(totalBudget.spent, totalBudget.amount) ===
                      "warning" && "[&>div]:bg-warning",
                    getStatus(totalBudget.spent, totalBudget.amount) ===
                      "over" && "[&>div]:bg-destructive"
                  )}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => openEditDialog(totalBudget)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Budget
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Category Budgets */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryBudgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.amount) * 100,
              100
            );
            const status = getStatus(budget.spent, budget.amount);
            const icon = CATEGORY_ICONS[budget.category as TransactionCategory];
            const label =
              CATEGORY_LABELS[budget.category as TransactionCategory];

            return (
              <Card key={budget.id} className="group relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xl">
                        {icon}
                      </div>
                      <CardTitle className="text-base">{label}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => openEditDialog(budget)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(budget.spent)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        of {formatCurrency(budget.amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {status === "normal" && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {status === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      )}
                      {status === "over" && (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          status === "normal" && "text-success",
                          status === "warning" && "text-warning",
                          status === "over" && "text-destructive"
                        )}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-2",
                      status === "normal" && "[&>div]:bg-success",
                      status === "warning" && "[&>div]:bg-warning",
                      status === "over" && "[&>div]:bg-destructive"
                    )}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
