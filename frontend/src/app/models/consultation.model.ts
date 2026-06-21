import { Patient } from './patient.model';
import { User } from './user.model';

export interface Consultation {
  _id?: string;
  requestedBy?: string | User;
  doctor: string | User;
  patient?: string | Patient;
  reason?: string;
  roomId: string;
  status?: 'requested' | 'in_progress' | 'completed' | 'cancelled';
  summary?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
}
