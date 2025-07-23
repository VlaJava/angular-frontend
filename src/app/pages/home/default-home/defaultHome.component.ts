import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageLayoutComponent } from '../../../components/packages-layout/packages-layout.component';
import { PackageService } from '../../../services/package.service';
import { PacoteViagem } from '../../../models/pacote-viagem';

@Component({
  selector: 'app-travel-packages',
  standalone: true,
  imports: [
    CommonModule,
    PackageLayoutComponent
  ],
  templateUrl: './defaultHome.component.html',
  styleUrls: ['./defaultHome.component.scss']
})
// interface OnInit
export class DefaultHomeComponent implements OnInit {

  // ropriedade para armazenar os pacotes
  pacotes: PacoteViagem[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.pacotes = this.packageService.getPackages();
  }
}