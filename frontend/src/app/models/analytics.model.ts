import { Invoice } from './invoice.model';
import { Appointment } from './appointment.model';

export interface AnalyticsOverview {
  counts: {
    patients: number;
    doctors: number;
    appointments: number;
    prescriptions: number;
    invoices: number;
    screenings: number;
    records: number;
  };
  appointmentsByStatus: Record<string, number>;
  screeningByRisk: Record<string, number>;
  revenue: { billed: number; collected: number; outstanding: number };
  patientsTrend: { month: string; count: number }[];
  recentInvoices: Invoice[];
  recentAppointments: Appointment[];
}
