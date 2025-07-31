import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';
import { PackageService } from '../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-package-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './package-modal.component.html',
  styleUrls: ['./package-modal.component.scss']
})
export class PackageModalComponent implements OnInit, OnChanges {

  // 1. Recebe o pacote para editar (pode ser null se for para adicionar)
  @Input() packageToEdit: Package | null = null;
  
  // 2. Notifica o pai se a operação foi salva (true) ou cancelada (false)
  @Output() close = new EventEmitter<boolean>();

  packageForm: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private toastr: ToastrService
  ) {
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

  ngOnInit(): void {
    
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['packageToEdit'] && this.packageToEdit) {
      this.isEditMode = true;
      
      const formattedStartDate = new Date(this.packageToEdit.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(this.packageToEdit.endDate).toISOString().split('T')[0];
      
      this.packageForm.patchValue({
        ...this.packageToEdit,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
    } else {
      
      this.isEditMode = false;
      this.packageForm.reset({ available: true }); 
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSave(): void {
    if (this.packageForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      this.packageForm.markAllAsTouched();
      return;
    }

    const packageData = this.packageForm.value;

    let saveObservable: Observable<Package>;

    if (this.isEditMode && this.packageToEdit) {
      
      saveObservable = this.packageService.updatePackage(this.packageToEdit.id, packageData);
    } else {
    
      saveObservable = this.packageService.createPackage(packageData);
    }

    saveObservable.subscribe({
      next: () => {
        this.close.emit(true); 
      },
      error: (err) => {
        this.toastr.error('Falha ao salvar o pacote.');
        console.error(err);
        this.close.emit(false); 
      }
    });
  }

  onCancel(): void {
    this.close.emit(false); 
  }
}
