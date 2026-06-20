import { Patient } from './patient.model';
import { User } from './user.model';

// A single prescribed medicine line
export interface PrescriptionItem {
  drugName: string;
  dosage?: string;
  frequency?: string;
  durationDays?: number;
  instructions?: string;
}

// Shape of a prescription. patient/doctor are populated when listed.
export interface Prescription {
  _id?: string;
  patient: string | Patient;
  doctor: string | User;
  diagnosis?: string;
  items: PrescriptionItem[];
  notes?: string;
  status?: 'active' | 'completed' | 'cancelled';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
