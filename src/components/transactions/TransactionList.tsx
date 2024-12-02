import React from 'react';
import { Transaction } from '../../types/finance';
import { Card } from '../ui/card';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0">
    <div className="flex items-center space-x-4">
      <div className={`w-2 h-2 rounded-full ${
        transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-500">{transaction.category}</p>
      </div>
    </div>
    <div>
      <p className={`font-semibold ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        {new Date(transaction.date).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const TransactionList = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: new Date(),
      amount: 1000,
      type: 'income',
      category: 'Salary',
      description: 'Monthly salary',
    },
    {
      id: '2',
      date: new Date(),
      amount: 50,
      type: 'expense',
      category: 'Food',
      description: 'Grocery shopping',
    },
  ];

  return (
    <Card className="mt-6">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      <div className="divide-y">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </Card>
  );
};

export default TransactionList;
