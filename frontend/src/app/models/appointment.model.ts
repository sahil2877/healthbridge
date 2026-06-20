import { Patient } from './patient.model';
import { User } from './user.model';

// Shape of an appointment. When listed, patient/doctor come back populated
// (full objects); when sending to the API they are just id strings.
export interface Appointment {
  _id?: string;
  patient: string | Patient;
  doctor: string | User;
  date: string;            // ISO date-time
  reason: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  bookedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
