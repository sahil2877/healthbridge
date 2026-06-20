import { Patient } from './patient.model';
import { User } from './user.model';

// A single uploaded file attached to a clinical record
export interface RecordDocument {
  _id?: string;
  fileName: string;
  originalName: string;
  url: string;            // e.g. /uploads/123.pdf
  uploadedAt?: string;
}

// Shape of a clinical record. patient/doctor are populated when listed.
export interface ClinicalRecord {
  _id?: string;
  patient: string | Patient;
  doctor: string | User;
  visitDate?: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  documents?: RecordDocument[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
