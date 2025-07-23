import { Component, Input } from '@angular/core';
import { PacoteViagem } from '../../models/pacote-viagem';
import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-packages-layout',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent
  ],
  templateUrl: './packages-layout.component.html',
  styleUrl: './packages-layout.component.scss'
})
export class PackageLayoutComponent {

  @Input() pacotes: PacoteViagem[] = [];

  constructor() { }

}