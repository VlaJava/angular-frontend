import { Component, OnInit } from '@angular/core'; // Importar OnInit
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Importar Observable

import { PackageCardComponent } from '../package-card/package-card.component';
import { Package } from '../../types/package.type';
import { PackageService } from '../../services/package.service'; // Importar o serviço

@Component({
  selector: 'app-packages-layout',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent
  ],
  templateUrl: './packages-layout.component.html',
  styleUrls: ['./packages-layout.component.scss']
})
export class PackageLayoutComponent implements OnInit { 

  
  public pacotes$!: Observable<Package[]>;

  
  constructor(private packageService: PackageService) { }

  
  ngOnInit(): void {
    
    this.pacotes$ = this.packageService.getPackages();
  }
}
