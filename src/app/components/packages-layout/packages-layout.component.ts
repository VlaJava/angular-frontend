import { Component, OnInit } from '@angular/core'; // Importar OnInit
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; 
import { map } from 'rxjs/operators';
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
    this.pacotes$ = this.packageService.getPackages().pipe(
      map((pacotes: Package[]) =>
        pacotes
          .filter(p => p.available)
          .slice(0, 3)
      )
    );
  }
}
