import { Patient } from './patient.model';
import { User } from './user.model';

export interface LabPackage {
  _id?: string;
  name: string;
  tests: number;
  price: number;
  mrp?: number;
  category: string;
}

export interface LabOrderItem {
  name: string;
  price: number;
}

export interface LabOrder {
  _id?: string;
  orderNumber?: string;
  bookedBy?: string | User;
  patient?: string | Patient;
  contactName?: string;
  contactPhone?: string;
  items: LabOrderItem[];
  total?: number;
  collectionAddress?: string;
  collectionSlot?: string;
  status?: 'booked' | 'collected' | 'in_lab' | 'report_ready' | 'cancelled';
  reportUrl?: string;
  createdAt?: string;
}

// Ordered status steps for the tracker UI
export const LAB_STATUS_STEPS: { key: string; label: string }[] = [
  { key: 'booked', label: 'Booked' },
  { key: 'collected', label: 'Sample Collected' },
  { key: 'in_lab', label: 'In Lab' },
  { key: 'report_ready', label: 'Report Ready' }
];
