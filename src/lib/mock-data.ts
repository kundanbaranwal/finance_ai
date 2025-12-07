import { Transaction, Budget, SpendingInsight, TransactionCategory } from '@/types/finance';

const generateId = () => Math.random().toString(36).substring(2, 11);

const categories: TransactionCategory[] = ['food', 'rent', 'transport', 'shopping', 'subscriptions', 'utilities', 'entertainment', 'healthcare', 'other'];

const transactionDescriptions: Record<TransactionCategory, string[]> = {
  food: ['Uber Eats', 'Whole Foods', 'Starbucks', 'McDonalds', 'Chipotle', 'DoorDash'],
  rent: ['Monthly Rent', 'Property Management'],
  transport: ['Uber', 'Lyft', 'Gas Station', 'Metro Card', 'Parking'],
  shopping: ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Nike'],
  subscriptions: ['Netflix', 'Spotify', 'Adobe CC', 'iCloud', 'Gym Membership'],
  utilities: ['Electric Bill', 'Water Bill', 'Internet', 'Phone Bill'],
  entertainment: ['Movie Theater', 'Concert Tickets', 'Game Purchase'],
  healthcare: ['CVS Pharmacy', 'Doctor Visit', 'Insurance'],
  income: ['Salary', 'Freelance Payment', 'Refund'],
  other: ['ATM Withdrawal', 'Transfer', 'Miscellaneous'],
};

export const generateMockTransactions = (count: number = 50): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descriptions = transactionDescriptions[category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    let amount: number;
    if (category === 'income') {
      amount = Math.floor(Math.random() * 3000) + 1000;
    } else if (category === 'rent') {
      amount = -(Math.floor(Math.random() * 500) + 1500);
    } else {
      amount = -(Math.floor(Math.random() * 150) + 10);
    }
    
    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      description,
      amount,
      category,
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateMockBudgets = (): Budget[] => {
  return [
    { id: generateId(), category: 'total', amount: 5000, spent: 3850 },
    { id: generateId(), category: 'food', amount: 600, spent: 520 },
    { id: generateId(), category: 'transport', amount: 300, spent: 180 },
    { id: generateId(), category: 'shopping', amount: 400, spent: 450 },
    { id: generateId(), category: 'subscriptions', amount: 150, spent: 120 },
    { id: generateId(), category: 'entertainment', amount: 200, spent: 85 },
  ];
};

export const generateMockInsight = (): SpendingInsight => {
  return {
    summary: "This month you've spent $3,850 out of your $5,000 budget. Your spending is primarily focused on housing and food, which is typical. However, your shopping expenses have exceeded the budget by 12.5%.",
    topCategories: [
      { category: 'rent', amount: 1800, percentage: 46.8 },
      { category: 'food', amount: 520, percentage: 13.5 },
      { category: 'shopping', amount: 450, percentage: 11.7 },
      { category: 'transport', amount: 180, percentage: 4.7 },
      { category: 'subscriptions', amount: 120, percentage: 3.1 },
    ],
    savingTips: [
      "Consider meal prepping to reduce food delivery expenses - you could save ~$150/month",
      "Review your subscriptions - you have 3 streaming services that could be consolidated",
      "Your shopping category is over budget - try implementing a 24-hour rule before purchases",
      "Use public transport more frequently to cut transport costs by 30%",
    ],
    suggestedSavingGoal: 400,
    alerts: [
      "⚠️ Shopping budget exceeded by $50",
      "ℹ️ You're at 77% of your monthly budget with 8 days remaining",
    ],
  };
};

export const mockTransactions = generateMockTransactions();
export const mockBudgets = generateMockBudgets();
export const mockInsight = generateMockInsight();
