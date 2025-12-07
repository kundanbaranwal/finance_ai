import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockInsight, mockTransactions } from '@/lib/mock-data';
import { CATEGORY_LABELS, CATEGORY_ICONS, TransactionCategory } from '@/types/finance';
import { Sparkles, TrendingUp, TrendingDown, Lightbulb, Target, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Insights() {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState(mockInsight);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">AI Insights</h1>
            <p className="text-muted-foreground">Smart analysis of your spending patterns</p>
          </div>
          <Button variant="glow" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <Card className="border-primary/20">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <div className="relative">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Analyzing your spending...</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is reviewing your transactions
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>Monthly Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{insight.summary}</p>
              </CardContent>
            </Card>

            {/* Alerts */}
            {insight.alerts.length > 0 && (
              <Card className="border-warning/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <CardTitle>Alerts & Notifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insight.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                      <p>{alert}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Top Spending Categories</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insight.topCategories.map((cat, index) => (
                    <div key={cat.category} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">
                        {CATEGORY_ICONS[cat.category]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {CATEGORY_LABELS[cat.category]}
                          </span>
                          <span className="font-mono font-semibold">
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-12 text-right text-sm text-muted-foreground">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saving Tips */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle>Personalized Saving Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insight.savingTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Goal */}
            <Card className="border-success/20 bg-gradient-to-br from-card to-success/5">
              <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <Target className="h-7 w-7 text-success" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Recommended Monthly Savings</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your income and spending patterns
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-4xl font-bold text-success">
                    {formatCurrency(insight.suggestedSavingGoal)}
                  </p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
