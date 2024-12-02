import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  description: string;
  contact: string;
  email: string;
}

interface Contract {
  id: string;
  reference: string;
  supplierName: string;
  startDate: string;
  endDate: string;
}

interface Invoice {
  id: string;
  reference: string;
  supplierName: string;
  amount: number;
  date: string;
}

// Simulated API calls
const api = {
  async fetchSuppliers(): Promise<Supplier[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        name: 'Fournisseur A',
        description: 'Description du fournisseur A',
        contact: '+225 0123456789',
        email: 'contact@fournisseura.com',
      },
      {
        id: '2',
        name: 'Fournisseur B',
        description: 'Description du fournisseur B',
        contact: '+225 9876543210',
        email: 'contact@fournisseurb.com',
      },
    ];
  },
  async fetchContracts(): Promise<Contract[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        reference: 'CONT-2023-001',
        supplierName: 'Fournisseur A',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      },
      {
        id: '2',
        reference: 'CONT-2023-002',
        supplierName: 'Fournisseur B',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
      },
    ];
  },
  async fetchInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        reference: 'FACT-2023-001',
        supplierName: 'Fournisseur A',
        amount: 1500000,
        date: '2023-03-15',
      },
      {
        id: '2',
        reference: 'FACT-2023-002',
        supplierName: 'Fournisseur B',
        amount: 2750000,
        date: '2023-07-01',
      },
    ];
  },
  async addSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
    };
  },
  async updateSupplier(id: string, data: Omit<Supplier, 'id'>): Promise<Supplier> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      ...data,
    };
  },
  async deleteSupplier(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  async viewContract(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate opening contract in new window
    window.open(`/contracts/${id}`, '_blank');
  },
  async downloadInvoice(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate downloading invoice
    const link = document.createElement('a');
    link.href = `/api/invoices/${id}/download`;
    link.download = `invoice-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, contractsData, invoicesData] = await Promise.all([
          api.fetchSuppliers(),
          api.fetchContracts(),
          api.fetchInvoices(),
        ]);

        setSuppliers(suppliersData);
        setContracts(contractsData);
        setInvoices(invoicesData);
      } catch (error) {
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addSupplier = async (data: Omit<Supplier, 'id'>) => {
    try {
      const newSupplier = await api.addSupplier(data);
      setSuppliers(prev => [...prev, newSupplier]);
      return newSupplier;
    } catch (error) {
      throw new Error('Erreur lors de l\'ajout du fournisseur');
    }
  };

  const updateSupplier = async (id: string, data: Omit<Supplier, 'id'>) => {
    try {
      const updatedSupplier = await api.updateSupplier(id, data);
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === id ? updatedSupplier : supplier
        )
      );
      return updatedSupplier;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du fournisseur');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await api.deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    } catch (error) {
      throw new Error('Erreur lors de la suppression du fournisseur');
    }
  };

  const viewContract = async (id: string) => {
    try {
      await api.viewContract(id);
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture du contrat');
    }
  };

  const downloadInvoice = async (id: string) => {
    try {
      await api.downloadInvoice(id);
      toast.success('Téléchargement de la facture en cours...');
    } catch (error) {
      toast.error('Erreur lors du téléchargement de la facture');
    }
  };

  return {
    suppliers,
    contracts,
    invoices,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    viewContract,
    downloadInvoice,
  };
};