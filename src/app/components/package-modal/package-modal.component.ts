import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';
import { PackageService } from '../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-package-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './package-modal.component.html',
    styleUrls: ['./package-modal.component.scss']
})
export class PackageModalComponent implements OnInit, OnChanges {

  @Input() packageToEdit: Package | null = null;
  @Output() close = new EventEmitter<boolean>();

  packageForm: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null; 

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.packageForm = this.fb.group({
      title: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      travelerLimit: [1, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      available: [true]
    });
  }

  ngOnInit(): void { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['packageToEdit'] && this.packageToEdit) {
      this.isEditMode = true;
      this.selectedFile = null;
      const formattedStartDate = new Date(this.packageToEdit.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(this.packageToEdit.endDate).toISOString().split('T')[0];
      
      this.packageForm.patchValue({ ...this.packageToEdit, startDate: formattedStartDate, endDate: formattedEndDate });
    } else {
      this.isEditMode = false;
      this.selectedFile = null;
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
    this.toastr.error('Preencha todos os campos obrigatórios.');
    return;
  }

  if (this.isEditMode && this.packageToEdit) {
 
    const formValueForUpdate = { ...this.packageForm.value };
   

    this.packageService.updatePackage(this.packageToEdit.id.toString(), formValueForUpdate).pipe(
  
    ).subscribe({
      next: () => {
        this.toastr.success('Pacote atualizado com sucesso!');
        this.close.emit(true);
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar o pacote.');
        console.error(err);
      }
    });

  } else {
   
    const formValueForCreate = { ...this.packageForm.value };

    
    delete formValueForCreate.available; 

   
    this.packageService.createPackage(formValueForCreate).subscribe({
      next: (createdPackage) => { 
        this.toastr.success('Pacote criado com sucesso! Redirecionando...');
        this.close.emit(true); 
        this.router.navigate([`/packages/${createdPackage.id}/admin`]); 
      },
      error: (err) => {
        this.toastr.error('Erro ao criar o pacote.');
        console.error(err);
      }
    });
  }
}
  onCancel(): void {
    this.close.emit(false);
  }
}