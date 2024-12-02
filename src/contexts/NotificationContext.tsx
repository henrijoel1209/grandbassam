import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'recette' | 'depense';
  montant: number;
  date: Date;
  category: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface NotificationContextType {
  notifyTransaction: (transaction: Transaction) => void;
  notifyImportantBalance: (balance: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const IMPORTANT_TRANSACTION_THRESHOLD = 1000000; // 1 million FCFA
const LOW_BALANCE_THRESHOLD = 100000; // 100,000 FCFA

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastNotifiedBalance, setLastNotifiedBalance] = useState<number | null>(null);

  const notifyTransaction = (transaction: Transaction) => {
    if (transaction.montant >= IMPORTANT_TRANSACTION_THRESHOLD) {
      const type = transaction.type === 'recette' ? 'Recette importante' : 'Dépense importante';
      toast(
        <div>
          <strong>{type}</strong>
          <p>{transaction.montant.toLocaleString()} FCFA - {transaction.category}</p>
        </div>,
        {
          icon: transaction.type === 'recette' ? '💰' : '⚠️',
          duration: 5000,
        }
      );
    }
  };

  const notifyImportantBalance = (balance: number) => {
    if (lastNotifiedBalance === null) {
      setLastNotifiedBalance(balance);
      return;
    }

    // Notify when balance drops below threshold
    if (balance < LOW_BALANCE_THRESHOLD && lastNotifiedBalance >= LOW_BALANCE_THRESHOLD) {
      toast.error(
        <div>
          <strong>Balance Faible</strong>
          <p>La balance est descendue en dessous de {LOW_BALANCE_THRESHOLD.toLocaleString()} FCFA</p>
        </div>,
        { duration: 7000 }
      );
    }
    
    // Notify significant changes (more than 20%)
    const changePercent = ((balance - lastNotifiedBalance) / lastNotifiedBalance) * 100;
    if (Math.abs(changePercent) >= 20) {
      const isIncrease = changePercent > 0;
      toast(
        <div>
          <strong>Changement Important de Balance</strong>
          <p>
            {isIncrease ? 'Augmentation' : 'Diminution'} de {Math.abs(changePercent).toFixed(1)}%
          </p>
        </div>,
        {
          icon: isIncrease ? '📈' : '📉',
          duration: 5000,
        }
      );
    }

    setLastNotifiedBalance(balance);
  };

  return (
    <NotificationContext.Provider value={{ notifyTransaction, notifyImportantBalance }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white',
          style: {
            border: '1px solid #E5E7EB',
            padding: '16px',
            color: '#1F2937',
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
