import { Component, Input } from '@angular/core';
import { PacoteViagem } from '../../models/pacote-viagem';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-package-card',
  standalone: true, 
  imports: [
    RouterModule 
  ],
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent {
  @Input() pacote!: PacoteViagem;
}