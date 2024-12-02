export interface Budget {
  id: string;
  year: number;
  department: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  status: 'draft' | 'active' | 'closed';
  lastModified: Date;
  createdAt: Date;
}

export interface BudgetAllocation {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  date: Date;
  approvedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  type: 'warning' | 'critical';
  message: string;
  threshold: number;
  triggered: Date;
  acknowledged: boolean;
}
