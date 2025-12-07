import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, change, icon, trend = 'neutral', className }: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow duration-300', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground md:text-3xl">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                {trend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' && 'text-success',
                    trend === 'down' && 'text-destructive',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
