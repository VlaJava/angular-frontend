import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Package } from '../../types/package.type';

@Component({
  selector: 'app-package-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './package-list-item.component.html',
  styleUrls: ['./package-list-item.component.scss']
})
export class PackageListItemComponent {
  @Input() pacote!: Package;
}
