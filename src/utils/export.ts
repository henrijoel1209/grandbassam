import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportData {
  Date: string;
  Type: string;
  Catégorie: string;
  Montant: string;
  Statut: string;
  Description: string;
}

export const exportToPDF = (data: ExportData[], title: string = 'Rapport Financier'): void => {
  const doc = new jsPDF();
  
  // Ajouter le titre
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Date d'exportation: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

  // Configurer le tableau
  const headers = [['Date', 'Type', 'Catégorie', 'Montant', 'Statut', 'Description']];
  const rows = data.map(item => [
    item.Date,
    item.Type,
    item.Catégorie,
    item.Montant,
    item.Statut,
    item.Description
  ]);

  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: 40,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [46, 125, 50] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Sauvegarder le PDF
  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (data: ExportData[], title: string = 'Rapport Financier'): void => {
  // Créer une feuille de calcul
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Créer un classeur
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Données');

  // Générer le fichier Excel
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Sauvegarder le fichier
  saveAs(blob, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (data: ExportData[], title: string = 'Rapport Financier'): void => {
  // Convertir les données en format CSV
  const headers = ['Date', 'Type', 'Catégorie', 'Montant', 'Statut', 'Description'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.Date,
      row.Type,
      row.Catégorie,
      row.Montant,
      row.Statut,
      row.Description
    ].join(','))
  ].join('\n');

  // Créer et sauvegarder le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${title}_${new Date().toISOString().split('T')[0]}.csv`);
};
