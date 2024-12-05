import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTransactions } from './useTransactions';
import type { Supplier, Contract, Invoice, InvoiceItem, SupplierEvaluation } from '@/types/supplier';
import type { Transaction } from '@/types/transaction';

// Local Storage Keys
const STORAGE_KEYS = {
  SUPPLIERS: 'grandbassam_suppliers',
  CONTRACTS: 'grandbassam_contracts',
  INVOICES: 'grandbassam_invoices',
  EVALUATIONS: 'grandbassam_evaluations',
};

// Helper functions for localStorage
const getStorageItem = <T>(key: string, defaultValue: T[]): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [evaluations, setEvaluations] = useState<SupplierEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const { addTransaction } = useTransactions('month', 'all');

  // Load data from localStorage on mount
  useEffect(() => {
    setSuppliers(getStorageItem(STORAGE_KEYS.SUPPLIERS, []));
    setContracts(getStorageItem(STORAGE_KEYS.CONTRACTS, []));
    setInvoices(getStorageItem(STORAGE_KEYS.INVOICES, []));
    setEvaluations(getStorageItem(STORAGE_KEYS.EVALUATIONS, []));
    setLoading(false);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!loading) {
      setStorageItem(STORAGE_KEYS.SUPPLIERS, suppliers);
      setStorageItem(STORAGE_KEYS.CONTRACTS, contracts);
      setStorageItem(STORAGE_KEYS.INVOICES, invoices);
      setStorageItem(STORAGE_KEYS.EVALUATIONS, evaluations);
    }
  }, [suppliers, contracts, invoices, evaluations, loading]);

  const addSupplier = async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newSupplier: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = async (id: string, data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) {
      throw new Error('Fournisseur non trouvé');
    }

    const updatedSupplier: Supplier = {
      ...supplier,
      ...data,
      updatedAt: new Date(),
    };

    setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    return updatedSupplier;
  };

  const deleteSupplier = async (id: string) => {
    const hasContracts = contracts.some(c => c.supplierId === id);
    const hasInvoices = invoices.some(i => i.supplierId === id);

    if (hasContracts || hasInvoices) {
      throw new Error('Ce fournisseur a des contrats ou des factures associés');
    }

    setSuppliers(prev => prev.filter(s => s.id !== id));
    setEvaluations(prev => prev.filter(e => e.supplierId !== id));
  };

  const addContract = async (data: Omit<Contract, 'id' | 'documents'>) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) {
      throw new Error('Fournisseur non trouvé');
    }

    const newContract: Contract = {
      id: Math.random().toString(36).substr(2, 9),
      documents: [],
      ...data,
    };

    setContracts(prev => [...prev, newContract]);
    return newContract;
  };

  const updateContract = async (id: string, data: Omit<Contract, 'id' | 'documents'>) => {
    const contract = contracts.find(c => c.id === id);
    if (!contract) {
      throw new Error('Contrat non trouvé');
    }

    const updatedContract: Contract = {
      ...contract,
      ...data,
    };

    setContracts(prev => prev.map(c => c.id === id ? updatedContract : c));
    return updatedContract;
  };

  const deleteContract = async (id: string) => {
    const hasInvoices = invoices.some(i => i.contractId === id);
    if (hasInvoices) {
      throw new Error('Ce contrat a des factures associées');
    }

    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const addInvoice = async (data: Omit<Invoice, 'id' | 'status'>) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) {
      throw new Error('Fournisseur non trouvé');
    }

    if (data.contractId) {
      const contract = contracts.find(c => c.id === data.contractId);
      if (!contract) {
        throw new Error('Contrat non trouvé');
      }
    }

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      ...data,
    };

    // Créer une transaction de dépense associée
    const transaction: Omit<Transaction, 'id'> = {
      type: 'depense',
      montant: newInvoice.amount,
      date: newInvoice.date,
      category: supplier.category[0], // Utiliser la première catégorie du fournisseur
      status: 'pending',
      description: `Facture ${newInvoice.number} - ${supplier.name}`,
      beneficiaire: supplier.name,
      reference: newInvoice.number,
    };

    await addTransaction(transaction);
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = async (id: string, data: Omit<Invoice, 'id' | 'status'>) => {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) {
      throw new Error('Facture non trouvée');
    }

    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) {
      throw new Error('Fournisseur non trouvé');
    }

    if (data.contractId) {
      const contract = contracts.find(c => c.id === data.contractId);
      if (!contract) {
        throw new Error('Contrat non trouvé');
      }
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      ...data,
    };

    setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i));
    return updatedInvoice;
  };

  const deleteInvoice = async (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const addEvaluation = async (data: Omit<SupplierEvaluation, 'id' | 'date' | 'overallScore'>) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) {
      throw new Error('Fournisseur non trouvé');
    }

    const overallScore = (data.quality + data.delivery + data.communication + data.pricing) / 4;

    const newEvaluation: SupplierEvaluation = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      overallScore,
      ...data,
    };

    setEvaluations(prev => [...prev, newEvaluation]);

    // Mettre à jour la note du fournisseur
    const supplierEvaluations = [...evaluations, newEvaluation].filter(e => e.supplierId === data.supplierId);
    const averageRating = supplierEvaluations.reduce((acc, curr) => acc + curr.overallScore, 0) / supplierEvaluations.length;

    await updateSupplier(data.supplierId, {
      ...supplier,
      rating: averageRating,
    });

    return newEvaluation;
  };

  return {
    suppliers,
    contracts,
    invoices,
    evaluations,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addContract,
    updateContract,
    deleteContract,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addEvaluation,
  };
};

export default useSuppliers;