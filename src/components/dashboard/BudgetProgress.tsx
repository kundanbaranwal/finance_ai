import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/finance';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const getStatus = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.map((budget) => {
          const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
          const status = getStatus(budget.spent, budget.amount);
          const label = budget.category === 'total' ? 'Total Budget' : CATEGORY_LABELS[budget.category];
          const icon = budget.category === 'total' ? '💰' : CATEGORY_ICONS[budget.category];

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      status === 'normal' && 'bg-success/10 text-success',
                      status === 'warning' && 'bg-warning/10 text-warning',
                      status === 'over' && 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {status === 'over' ? 'Over' : `${percentage.toFixed(0)}%`}
                  </span>
                </div>
              </div>
              <Progress
                value={percentage}
                className={cn(
                  'h-2',
                  status === 'normal' && '[&>div]:bg-success',
                  status === 'warning' && '[&>div]:bg-warning',
                  status === 'over' && '[&>div]:bg-destructive'
                )}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
