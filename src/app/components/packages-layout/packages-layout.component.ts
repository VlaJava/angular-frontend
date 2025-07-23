import { Component, Input } from '@angular/core';

import { PackageCardComponent } from '../package-card/package-card.component';
import { CommonModule } from '@angular/common';
import { Package } from '../../types/package.type';


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

  @Input() pacotes: Package[] = [];

  constructor() { }

}