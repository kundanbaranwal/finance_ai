import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { mockTransactions, mockBudgets, mockInsight } from "@/lib/mock-data";
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { useMemo } from "react";
import {
  useTransactions,
  useBudgets,
  useAnalysis,
  useGenerateAnalysis,
} from "@/hooks/useApi";

export default function Dashboard() {
  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactions();
  const { data: budgetsData, isLoading: isLoadingBudgets } = useBudgets();
  const { data: analysisData, isLoading: isLoadingAnalysis } = useAnalysis();
  const generateAnalysisMutation = useGenerateAnalysis();

  // Use real data if available, fallback to mock
  const transactions = transactionsData?.data || mockTransactions;
  const budgets = budgetsData?.data || mockBudgets;
  const insight = analysisData?.data || mockInsight;

  const stats = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisMonthTransactions = transactions.filter(
      (t: any) => new Date(t.date).getMonth() === thisMonth
    );

    const totalSpent = thisMonthTransactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalIncome = thisMonthTransactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const balance = totalIncome - totalSpent;
    const transactionCount = thisMonthTransactions.length;

    return { totalSpent, totalIncome, balance, transactionCount };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRefreshInsight = async () => {
    await generateAnalysisMutation.mutateAsync();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Balance"
            value={formatCurrency(stats.balance)}
            change={12.5}
            trend="up"
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            className="animate-slide-up"
          />
          <StatCard
            title="Monthly Income"
            value={formatCurrency(stats.totalIncome)}
            change={8.2}
            trend="up"
            icon={<TrendingUp className="h-6 w-6 text-success" />}
            className="animate-slide-up [animation-delay:100ms]"
          />
          <StatCard
            title="Monthly Spending"
            value={formatCurrency(stats.totalSpent)}
            change={-5.4}
            trend="down"
            icon={<CreditCard className="h-6 w-6 text-warning" />}
            className="animate-slide-up [animation-delay:200ms]"
          />
          <StatCard
            title="Transactions"
            value={stats.transactionCount.toString()}
            icon={<PiggyBank className="h-6 w-6 text-chart-3" />}
            className="animate-slide-up [animation-delay:300ms]"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <SpendingChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </div>

        {/* AI Insights & Budget */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AIInsightsCard
            insight={insight}
            onRefresh={handleRefreshInsight}
            isLoading={generateAnalysisMutation.isPending || isLoadingAnalysis}
          />
          <BudgetProgress budgets={budgets} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} limit={6} />
      </div>
    </AppLayout>
  );
}
