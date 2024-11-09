import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Patient } from '../types/patient';
import type { Consultation } from '../types/consultation';
import type { Appointment } from '../types/appointment';

interface ExportData {
  patients: Patient[];
  consultations: Consultation[];
  appointments: Appointment[];
  activeTab: string;
  dateFilter: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

export const exportToPDF = ({ patients, consultations, appointments, activeTab, dateFilter }: ExportData): void => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 15;

    // Add header
    doc.setFontSize(20);
    doc.text('IMD-Care Report', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, currentY, { align: 'center' });
    
    if (dateFilter.startDate && dateFilter.endDate) {
      currentY += 7;
      doc.text(
        `Period: ${format(new Date(dateFilter.startDate), 'dd/MM/yyyy')} to ${format(new Date(dateFilter.endDate), 'dd/MM/yyyy')}`,
        pageWidth / 2,
        currentY,
        { align: 'center' }
      );
    }
    
    currentY += 15;

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`imd-care-report-${format(new Date(), 'dd-MM-yyyy-HHmm')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate report');
  }
};