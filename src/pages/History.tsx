import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthSummary {
  month: string;
  year: number;
  totalSpent: number;
  totalIncome: number;
  topCategory: string;
  aiSummary: string;
  change: number;
}

const mockHistory: MonthSummary[] = [
  {
    month: 'November',
    year: 2024,
    totalSpent: 3850,
    totalIncome: 5200,
    topCategory: 'Rent & Housing',
    aiSummary: 'Spending was within budget. Shopping increased by 15% compared to last month. Consider reviewing subscription services.',
    change: -5.2,
  },
  {
    month: 'October',
    year: 2024,
    totalSpent: 4062,
    totalIncome: 5200,
    topCategory: 'Rent & Housing',
    aiSummary: 'Higher than usual spending on entertainment. Food expenses were well managed. Good job maintaining transport budget.',
    change: 8.1,
  },
  {
    month: 'September',
    year: 2024,
    totalSpent: 3758,
    totalIncome: 5000,
    topCategory: 'Rent & Housing',
    aiSummary: 'Excellent month for savings! Reduced discretionary spending by 20%. Healthcare costs were higher than average.',
    change: -12.3,
  },
  {
    month: 'August',
    year: 2024,
    totalSpent: 4285,
    totalIncome: 5000,
    topCategory: 'Shopping',
    aiSummary: 'Back-to-season shopping spike noticed. Food delivery expenses increased. Consider meal planning for next month.',
    change: 15.7,
  },
  {
    month: 'July',
    year: 2024,
    totalSpent: 3704,
    totalIncome: 5000,
    topCategory: 'Rent & Housing',
    aiSummary: 'Balanced spending across categories. Subscription audit saved $45. Transportation costs down due to remote work.',
    change: -3.2,
  },
];

export default function History() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredHistory = mockHistory.filter(h => h.year.toString() === selectedYear);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">History</h1>
            <p className="text-muted-foreground">View past months with AI summaries</p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Monthly History */}
        <div className="space-y-4">
          {filteredHistory.map((summary) => {
            const isExpanded = expandedMonth === `${summary.month}-${summary.year}`;
            const savings = summary.totalIncome - summary.totalSpent;
            const savingsRate = ((savings / summary.totalIncome) * 100).toFixed(1);

            return (
              <Card
                key={`${summary.month}-${summary.year}`}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isExpanded && 'ring-1 ring-primary'
                )}
                onClick={() => setExpandedMonth(isExpanded ? null : `${summary.month}-${summary.year}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <span className="text-lg font-bold">{summary.month.slice(0, 3)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {summary.month} {summary.year}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Top category: {summary.topCategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(summary.totalSpent)}</p>
                        <div className="flex items-center justify-end gap-1">
                          {summary.change < 0 ? (
                            <TrendingUp className="h-3 w-3 text-success" />
                          ) : (
                            <TrendingUp className="h-3 w-3 rotate-180 text-destructive" />
                          )}
                          <span
                            className={cn(
                              'text-xs font-medium',
                              summary.change < 0 ? 'text-success' : 'text-destructive'
                            )}
                          >
                            {summary.change > 0 ? '+' : ''}{summary.change}%
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t border-border pt-4">
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Stats */}
                      <div className="space-y-4">
                        <div className="rounded-lg bg-secondary/50 p-4">
                          <p className="text-sm text-muted-foreground">Total Income</p>
                          <p className="text-xl font-bold text-success">
                            {formatCurrency(summary.totalIncome)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-secondary/50 p-4">
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="text-xl font-bold">{formatCurrency(summary.totalSpent)}</p>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-4">
                          <p className="text-sm text-muted-foreground">Savings</p>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(savings)} ({savingsRate}%)
                          </p>
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="md:col-span-2">
                        <div className="rounded-lg bg-gradient-to-br from-secondary/50 to-primary/5 p-6">
                          <div className="mb-3 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="font-medium">AI Monthly Summary</span>
                          </div>
                          <p className="leading-relaxed text-muted-foreground">
                            {summary.aiSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {filteredHistory.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No history available for {selectedYear}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
