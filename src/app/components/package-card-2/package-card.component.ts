import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelPackage } from '../../types/travel.types';

@Component({
  selector: 'app-package-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss']
})
export class PackageCardComponent {
  @Input() pack!: TravelPackage;
}
