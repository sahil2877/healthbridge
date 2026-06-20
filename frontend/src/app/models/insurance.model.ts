import { Patient } from './patient.model';

export interface InsurancePolicy {
  _id?: string;
  patient: string | Patient;
  payerName: string;
  policyNumber: string;
  holderName?: string;
  coverageAmount?: number;
  validFrom?: string;
  validTo?: string;
  notes?: string;
  createdAt?: string;
}

export interface PolicyRef {
  _id?: string;
  payerName?: string;
  policyNumber?: string;
  coverageAmount?: number;
}

export interface Claim {
  _id?: string;
  claimNumber?: string;
  policy: string | PolicyRef;
  patient: string | Patient;
  invoice?: string;
  amountClaimed: number;
  amountApproved?: number;
  preAuthNo?: string;
  notes?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  createdAt?: string;
}
