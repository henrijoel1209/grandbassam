export interface Transaction {
  id: string;
  type: 'recette' | 'depense';
  montant: number;
  date: Date;
  category: string;
  status: 'pending' | 'completed' | 'cancelled';
  description?: string;
  // Champs spécifiques aux recettes
  contribuable?: string;
  reference?: string;
  // Champs spécifiques aux dépenses
  beneficiaire?: string;
}
