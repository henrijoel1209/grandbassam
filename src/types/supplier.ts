export interface Supplier {
  id: string;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'blacklisted';
  category: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  supplierId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  documents: ContractDocument[];
  terms: string;
}

export interface ContractDocument {
  id: string;
  type: 'contract' | 'amendment' | 'invoice' | 'other';
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Invoice {
  id: string;
  supplierId: string;
  contractId: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'disputed';
  items: InvoiceItem[];
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tax: number;
}

export interface SupplierEvaluation {
  id: string;
  supplierId: string;
  evaluator: string;
  date: Date;
  criteria: {
    quality: number;
    delivery: number;
    communication: number;
    pricing: number;
  };
  comments: string;
  overallScore: number;
}
