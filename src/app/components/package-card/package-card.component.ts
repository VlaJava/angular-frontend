import { Component, Input } from '@angular/core';
import { PacoteViagem } from '../../models/pacote-viagem';
import { RouterModule } from '@angular/router';
import { Package } from '../../types/package.type';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
    selector: 'app-package-card',
    standalone: true,
    imports: [
        RouterModule,
        TruncatePipe
         
    ],
    templateUrl: './package-card.component.html',
    styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent {
  @Input() pacote!: Package;
}