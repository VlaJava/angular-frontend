import { Component, Input } from '@angular/core';
import { PacoteViagem } from '../../models/pacote-viagem';

@Component({
  selector: 'app-package-card',
  standalone: true, 
  imports: [],
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent {
  @Input() pacote!: PacoteViagem;
}