import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagesLayoutComponent } from '../../../components/packages-layout/packages-layout.component';
;



@Component({
    selector: 'app-travel-packages',
    standalone: true,
    imports: [
        CommonModule,
        PackagesLayoutComponent 
    ],
    templateUrl: './travel-packages.component.html',
    styleUrls: ['./travel-packages.component.scss']
})
export class TravelPackagesComponent {}
