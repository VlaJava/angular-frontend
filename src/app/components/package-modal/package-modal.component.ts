import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Package } from '../../types/package.type';


@Component({
  selector: 'app-package-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './package-modal.component.html',
  styleUrls: ['./package-modal.component.scss']
})
export class PackageModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Package, 'id'>>();

  packageForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    
    this.packageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      imageUrl: [''],
      price: [null, [Validators.required, Validators.min(1)]],
      travelerLimit: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      available: [true, Validators.required]
    });
  }

  onSave(): void {
    this.packageForm.markAllAsTouched();

    if (this.packageForm.invalid) {
      return;
    }
    
    
    this.save.emit(this.packageForm.value);
  }

  onCancel(): void {
    this.close.emit();
  }
}
