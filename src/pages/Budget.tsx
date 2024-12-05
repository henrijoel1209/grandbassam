import { useState, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useTransactions } from '@/hooks/useTransactions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Budget() {
  const { invoices, contracts } = useSuppliers();
  const { transactions } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Calcul des statistiques budgétaires
  const stats = useMemo(() => {
    const currentMonthInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getFullYear() === selectedYear && invoiceDate.getMonth() === selectedMonth;
    });

    const totalInvoiced = currentMonthInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalPaid = currentMonthInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalPending = currentMonthInvoices
      .filter(invoice => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    const activeContracts = contracts.filter(contract => {
      const startDate = new Date(contract.startDate);
      const endDate = new Date(contract.endDate);
      const currentDate = new Date(selectedYear, selectedMonth);
      return startDate <= currentDate && endDate >= currentDate;
    });

    const totalContractValue = activeContracts.reduce((sum, contract) => sum + contract.value, 0);

    return {
      totalInvoiced,
      totalPaid,
      totalPending,
      totalContractValue,
      invoiceCount: currentMonthInvoices.length,
      contractCount: activeContracts.length
    };
  }, [invoices, contracts, selectedYear, selectedMonth]);

  // Données pour le graphique circulaire des statuts de factures
  const invoiceStatusData = {
    labels: ['Payées', 'En attente', 'En retard'],
    datasets: [{
      data: [
        invoices.filter(i => i.status === 'paid').length,
        invoices.filter(i => i.status === 'pending').length,
        invoices.filter(i => i.status === 'overdue').length
      ],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)'
      ]
    }]
  };

  // Données pour le graphique en barres des dépenses mensuelles
  const monthlyExpensesData = {
    labels: Array.from({ length: 12 }, (_, i) => 
      format(new Date(selectedYear, i), 'MMMM', { locale: fr })
    ),
    datasets: [{
      label: 'Dépenses mensuelles',
      data: Array.from({ length: 12 }, (_, month) => {
        return invoices
          .filter(invoice => {
            const date = new Date(invoice.date);
            return date.getFullYear() === selectedYear && date.getMonth() === month;
          })
          .reduce((sum, invoice) => sum + invoice.amount, 0);
      }),
      backgroundColor: 'rgb(59, 130, 246)'
    }]
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Suivi du Budget</h1>
          <p className="mt-2 text-sm text-gray-700">
            Aperçu des dépenses, factures et contrats
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i), 'MMMM', { locale: fr })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte des factures totales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Factures du mois</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.invoiceCount}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.totalInvoiced)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Carte des paiements */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Paiements effectués</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.totalPaid)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {((stats.totalPaid / stats.totalInvoiced) * 100).toFixed(1)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Carte des contrats actifs */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Contrats actifs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.contractCount}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats.totalContractValue)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Graphique des statuts de factures */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Statuts des factures</h3>
            <div className="h-64">
              <Pie data={invoiceStatusData} />
            </div>
          </div>
        </div>

        {/* Graphique des dépenses mensuelles */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Dépenses mensuelles {selectedYear}</h3>
            <div className="h-64">
              <Bar 
                data={monthlyExpensesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => {
                          return new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'XOF',
                            notation: 'compact'
                          }).format(value as number);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Transactions récentes</h3>
            <div className="mt-4">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions
                        .filter(transaction => {
                          const transactionDate = new Date(transaction.date);
                          return transactionDate.getFullYear() === selectedYear && 
                                 transactionDate.getMonth() === selectedMonth;
                        })
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                              {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {transaction.description}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={classNames(
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              )}>
                                {transaction.type === 'credit' ? 'Crédit' : 'Débit'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
