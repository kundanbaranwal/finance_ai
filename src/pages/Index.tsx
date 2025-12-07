import { Button } from '@/components/ui/button';
import { PiggyBank, ArrowRight, BarChart3, Shield, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">FinanceAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button variant="glow">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Take Control of Your{' '}
            <span className="text-gradient">Financial Future</span>
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Smart money management powered by AI. Track spending, set budgets, 
            and get personalized insights to help you save more and spend wisely.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="xl" variant="glow" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="xl" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI Analysis</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Everything You Need to Manage Money
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features to help you understand and improve your finances
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  title: 'Smart Dashboard',
                  description: 'Visual overview of your spending, income, and savings at a glance.',
                },
                {
                  icon: Sparkles,
                  title: 'AI Insights',
                  description: 'Get personalized recommendations and tips based on your spending patterns.',
                },
                {
                  icon: PiggyBank,
                  title: 'Budget Tracking',
                  description: 'Set limits for each category and get alerts when you\'re close to exceeding them.',
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-12 text-center shadow-glow">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Finances?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of users who are already saving smarter with FinanceAI.
            </p>
            <Link to="/auth">
              <Button size="xl" variant="glow" className="group">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              <span className="font-semibold">FinanceAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FinanceAI. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
