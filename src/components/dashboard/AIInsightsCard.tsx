import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingInsight } from '@/types/finance';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsightsCardProps {
  insight: SpendingInsight;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function AIInsightsCard({ insight, onRefresh, isLoading }: AIInsightsCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Insights</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs"
        >
          {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-sm leading-relaxed text-foreground">{insight.summary}</p>
        </div>

        {/* Alerts */}
        {insight.alerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span>Alerts</span>
            </div>
            <div className="space-y-2">
              {insight.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-2 text-sm"
                >
                  {alert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saving Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span>Saving Tips</span>
          </div>
          <ul className="space-y-2">
            {insight.savingTips.slice(0, 3).map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded-lg bg-secondary/30 px-4 py-2 text-sm"
              >
                <span className="mt-0.5 text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Goal */}
        <div className="flex items-center justify-between rounded-lg bg-success/10 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">Suggested Monthly Savings</span>
          </div>
          <span className="text-xl font-bold text-success">
            ${insight.suggestedSavingGoal}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
