import { Component, Input } from '@angular/core';
import { PacoteViagem } from '../../models/pacote-viagem';
import { RouterModule } from '@angular/router';
import { Package } from '../../types/package.type';

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
  @Input() pacote!: Package;
}