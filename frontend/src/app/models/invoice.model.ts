import { Patient } from './patient.model';

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount?: number;
  sourceType?: 'consultation' | 'lab' | 'pharmacy' | 'other';
}

export interface Payment {
  amount: number;
  method?: 'cash' | 'card' | 'upi' | 'wallet';
  reference?: string;
  paidAt?: string;
}

export interface Invoice {
  _id?: string;
  invoiceNumber?: string;
  patient: string | Patient;
  items: InvoiceItem[];
  payments?: Payment[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  amountPaid?: number;
  status?: 'unpaid' | 'partial' | 'paid';
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
