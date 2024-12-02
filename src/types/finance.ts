export type Transaction = {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
};

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetStatus: {
    total: number;
    used: number;
  };
};
