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
  onboardedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
