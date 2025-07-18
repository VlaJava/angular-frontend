import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageLayoutComponent } from '../../../components/packages-layout/packages-layout.component';



@Component({
  selector: 'app-travel-packages',
  standalone: true,
  imports: [
    CommonModule,
    PackageLayoutComponent // Corrigido
  
  
],
  templateUrl: './defaultHome.component.html',
  styleUrls: ['./defaultHome.component.scss']
})
export class DefaultHomeComponent {}
