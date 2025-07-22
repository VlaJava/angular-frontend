import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../services/package.service';  
import { PacoteViagem } from '../../models/pacote-viagem';   
import { CommonModule } from '@angular/common';       

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {

  pacote: PacoteViagem | undefined;

  constructor(
    private route: ActivatedRoute,         
    private router: Router,                 
    private packageService: PackageService  
  ) { }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const packageId = +idParam;
      
      this.pacote = this.packageService.getPackageById(packageId);

      // se não encontrar um pacote com o ID fornecido,
      // volta para a página inicial.
      if (!this.pacote) {
        this.router.navigate(['/']);
      }
    }
  }
}