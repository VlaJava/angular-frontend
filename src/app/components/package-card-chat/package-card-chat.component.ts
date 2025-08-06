import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelPackage } from '../../types/chatbot.types';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-package-card',
    standalone: true,
    imports: [CommonModule,
        RouterModule
    ],
    templateUrl: './package-card-chat.component.html',
    styleUrls: ['./package-card-chat.component.scss']
})
export class PackageCardComponent {
  @Input() pack!: TravelPackage;
}
