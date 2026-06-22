import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { PatientService } from '../../services/patient.service';
import { Invoice } from '../../models/invoice.model';
import { Patient } from '../../models/patient.model';

// One form for creating and editing an invoice, with dynamic line items and live totals.
@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>{{ isEdit ? 'Edit Invoice' : 'New Invoice' }}</h1>
          <p>{{ isEdit ? 'Update invoice line items and totals' : 'Generate a new billing invoice' }}</p>
        </div>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group" style="max-width:360px;">
            <label class="form-label">Patient *</label>
            <select class="form-control" formControlName="patient">
              <option value="">-- Select patient --</option>
              <option *ngFor="let p of patients" [value]="p._id">{{ p.name }} ({{ p.phone }})</option>
            </select>
            <div class="field-error" *ngIf="invalid('patient')">Patient required</div>
          </div>

          <!-- Line items -->
          <label class="form-label" style="margin:14px 0 8px;">Items *</label>
          <div formArrayName="items">
            <div class="form-row" *ngFor="let item of items.controls; let i = index" [formGroupName]="i"
                 style="align-items:end; grid-template-columns: 2fr 0.7fr 1fr 1fr auto; gap:10px;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" *ngIf="i===0">Description</label>
                <input class="form-control" type="text" formControlName="description" placeholder="e.g. Consultation fee" />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" *ngIf="i===0">Qty</label>
                <input class="form-control" type="number" formControlName="qty" />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" *ngIf="i===0">Unit ₹</label>
                <input class="form-control" type="number" formControlName="unitPrice" />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" *ngIf="i===0">Amount</label>
                <input class="form-control" type="text" [value]="'₹' + lineAmount(i)" disabled />
              </div>
              <button type="button" class="remove-med" (click)="removeItem(i)"
                      [disabled]="items.length === 1" title="Remove item">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" (click)="addItem()" style="margin:8px 0 16px;">
            <i class="fa-solid fa-plus"></i> Add item
          </button>

          <!-- Tax / discount -->
          <div class="form-grid" style="max-width:420px;">
            <div class="form-group"><label class="form-label">Tax (₹)</label>
              <input class="form-control" type="number" formControlName="tax" /></div>
            <div class="form-group"><label class="form-label">Discount (₹)</label>
              <input class="form-control" type="number" formControlName="discount" /></div>
          </div>

          <!-- Live totals -->
          <div class="card" style="background:var(--bg); max-width:320px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><b>₹{{ subtotal }}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Tax</span><span>+ ₹{{ num('tax') }}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>- ₹{{ num('discount') }}</span></div>
            <hr />
            <div style="display:flex; justify-content:space-between; font-size:1.1rem;"><b>Total</b><b>₹{{ total }}</b></div>
          </div>

          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-control" rows="2" formControlName="notes"></textarea>
          </div>

          <div style="display:flex; gap:10px; margin-top:8px;">
            <button class="btn btn-primary" type="submit" [disabled]="loading">
              <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-spin]="loading" [class.fa-floppy-disk]="!loading"></i>
              {{ loading ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice') }}
            </button>
            <a class="btn btn-ghost" routerLink="/invoices"><i class="fa-solid fa-xmark"></i> Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InvoiceFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  patients: Patient[] = [];

  form: FormGroup = this.fb.group({
    patient: ['', Validators.required],
    items: this.fb.array([this.newItem()]),
    tax: [0],
    discount: [0],
    notes: ['']
  });

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get items(): FormArray { return this.form.get('items') as FormArray; }

  private newItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      sourceType: ['other']
    });
  }

  addItem(): void { this.items.push(this.newItem()); }
  removeItem(i: number): void { if (this.items.length > 1) this.items.removeAt(i); }

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.invoiceService.getOne(this.id).subscribe({
        next: (inv) => { this.patchForm(inv); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load invoice'; this.loading = false; }
      });
    }
  }

  private patchForm(inv: Invoice): void {
    const patientId = typeof inv.patient === 'object' ? (inv.patient as Patient)._id : inv.patient;
    this.items.clear();
    (inv.items || []).forEach((it) => {
      const g = this.newItem();
      g.patchValue(it);
      this.items.push(g);
    });
    if (this.items.length === 0) this.items.push(this.newItem());
    this.form.patchValue({
      patient: patientId || '',
      tax: inv.tax || 0,
      discount: inv.discount || 0,
      notes: inv.notes || ''
    });
  }

  // --- live calculations ---
  lineAmount(i: number): number {
    const g = this.items.at(i).value;
    return (g.qty || 0) * (g.unitPrice || 0);
  }
  get subtotal(): number {
    return this.items.controls.reduce((s, _c, i) => s + this.lineAmount(i), 0);
  }
  num(field: string): number { return Number(this.form.get(field)?.value || 0); }
  get total(): number { return this.subtotal + this.num('tax') - this.num('discount'); }

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.touched && c.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const data = this.form.getRawValue() as unknown as Invoice;

    const req = this.isEdit && this.id
      ? this.invoiceService.update(this.id, data)
      : this.invoiceService.create(data);

    req.subscribe({
      next: (saved) => this.router.navigate(['/invoices', saved._id]),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save invoice';
        this.loading = false;
      }
    });
  }
}
