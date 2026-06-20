import { Patient } from './patient.model';
import { User } from './user.model';

// Shape of a health screening. The result fields (bmi, riskLevel, etc.)
// are computed by the backend; the form only sends the vitals.
export interface Screening {
  _id?: string;
  patient: string | Patient;

  // inputs (vitals)
  heightCm: number;
  weightKg: number;
  systolic?: number;
  diastolic?: number;
  smoker?: boolean;
  diabetic?: boolean;

  // computed results
  bmi?: number;
  bmiCategory?: string;
  riskScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  recommendations?: string[];

  screenedBy?: string | User;
  createdAt?: string;
  updatedAt?: string;
}
