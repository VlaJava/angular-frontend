import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common'; // Importe formatNumber
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PackageCardComponent } from '../package-card/package-card.component';
import { PackageService, PaginatedPackagesResponse } from '../../services/package.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// Interface para formatar os "pills" de filtros ativos
interface ActiveFilter {
  key: string;      // Ex: 'destination'
  label: string;    // Ex: 'Destino'
  value: string;    // Ex: 'Paris'
}

@Component({
    selector: 'app-packages-layout',
    standalone: true,
    imports: [
        CommonModule,
        PackageCardComponent,
        ReactiveFormsModule
    ],
    templateUrl: './packages-layout.component.html',
    styleUrls: ['./packages-layout.component.scss']
})
export class PackagesLayoutComponent implements OnInit, OnDestroy {

  searchForm!: FormGroup;
  private destroy$ = new Subject<void>();

  // --- NOVAS PROPRIEDADES ---
  areFiltersActive = false;
  activeFilters: ActiveFilter[] = [];

  paginatedResponse: PaginatedPackagesResponse = {
    content: [], currentPage: 0, totalItems: 0, totalPages: 0
  };
  isLoading = true;

  constructor(
    private packageService: PackageService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      source: [null],
      destination: [null],
      startDate: [null],
      endDate: [null],
      price: [15000]
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.updateActiveFilters(values); // Atualiza os "pills" e o título
      this.onSearch();
    });

    this.loadPackages();
    this.updateActiveFilters(this.searchForm.value); // Roda uma vez no início
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- NOVOS MÉTODOS ---

  /**
   * Atualiza a lista de filtros ativos (pills) e o estado do título.
   */
  private updateActiveFilters(values: any): void {
    this.activeFilters = []; // Limpa a lista atual

    if (values.source) {
      this.activeFilters.push({ key: 'source', label: 'Origem', value: values.source });
    }
    if (values.destination) {
      this.activeFilters.push({ key: 'destination', label: 'Destino', value: values.destination });
    }
    if (values.startDate) {
      this.activeFilters.push({ key: 'startDate', label: 'Data de Ida', value: values.startDate });
    }
    if (values.endDate) {
      this.activeFilters.push({ key: 'endDate', label: 'Data de Volta', value: values.endDate });
    }
    if (values.price < 15000) {
      const formattedPrice = `Até R$ ${formatNumber(values.price, 'pt-BR', '1.0-0')}`;
      this.activeFilters.push({ key: 'price', label: 'Orçamento', value: formattedPrice });
    }

    // Define se o título deve mudar
    this.areFiltersActive = this.activeFilters.length > 0;
  }

  /**
   * Remove um filtro específico quando o utilizador clica no 'x' do pill.
   */
  removeFilter(keyToRemove: string): void {
    const initialValue = keyToRemove === 'price' ? 15000 : null;
    this.searchForm.get(keyToRemove)?.setValue(initialValue);
  }

  // --- MÉTODOS EXISTENTES ---

  onSearch(): void {
    this.loadPackages(0);
  }

  loadPackages(page: number = 0): void {
    this.isLoading = true;
    const filters = this.searchForm.value;

    this.packageService.getPackages(page, 6, filters).subscribe({
      next: (data) => {
        this.paginatedResponse = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os pacotes.');
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  clearFilters(): void {
    this.searchForm.reset({
      source: null,
      destination: null,
      startDate: null,
      endDate: null,
      price: 15000
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.paginatedResponse.totalPages) {
      this.loadPackages(page);
    }
  }
  
  getPageNumbers(): number[] {
    if (!this.paginatedResponse || this.paginatedResponse.totalPages === 0) { return []; }
    return Array(this.paginatedResponse.totalPages).fill(0).map((x, i) => i);
  }
}