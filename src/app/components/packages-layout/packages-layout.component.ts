import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { PackageCardComponent } from '../package-card/package-card.component';
import { Package } from '../../types/package.type';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service'; 

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
      map((response: PaginatedPackagesResponse) =>
        response.content
          .filter(p => p.available)
          .slice(0, 3)
      )
    );
  }
}
