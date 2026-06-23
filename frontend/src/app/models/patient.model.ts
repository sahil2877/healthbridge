// Shape of a patient (matches the backend Patient model)
export interface Patient {
  _id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'Unknown';

  // Medical profile
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Physical measurements
  height?: number;   // cm
  weight?: number;   // kg

  onboardedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
