import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-package-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './package-modal.component.html',
  styleUrls: ['./package-modal.component.scss']
})
export class PackageModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  packageForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    origem: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
    valor: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    limiteViajantes: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    dataInicio: new FormControl('', [Validators.required]),
    dataFinal: new FormControl('', [Validators.required]),
    disponivel: new FormControl(false)
  });

  onCancel() {
    this.close.emit();
  }

  onSave() {
    if (this.packageForm.valid) {
      this.save.emit(this.packageForm.value);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
      // Lógica para lidar com o upload do arquivo
    }
  }
}
