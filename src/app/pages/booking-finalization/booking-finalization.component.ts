import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Traveler {
  name: string;
  document: string;
  birthDate: string;
}

@Component({
    selector: 'app-booking-finalization',
    imports: [FormsModule, CommonModule],
    templateUrl: './booking-finalization.component.html',
    styleUrl: './booking-finalization.component.scss'
})
export class BookingFinalizationComponent {
  startDate: string = '';
  endDate: string = '';
  packageDays: number = 1;

  packageTitle: string = '';
  packageDestination: string = '';
  packageDescription: string = '';
  packageValue: number = 0;
  packageImage: string = '';

  today: string = new Date().toISOString().split('T')[0];

constructor(private route: ActivatedRoute) {
  this.route.queryParams.subscribe(params => {
    this.packageTitle = params['title'] || '';
    this.packageDestination = params['destination'] || '';
    this.packageDescription = params['description'] || '';
    this.packageValue = params['value'] ? Number(params['value']) : 0;
    this.packageImage = params['image'];
    this.packageDays = params['days'] ? Number(params['days']) : 1;
  });
}

  travelers: Traveler[] = [
    { name: '', document: '', birthDate: '' }
  ];

  addTraveler() {
    this.travelers.push({ name: '', document: '', birthDate: '' });
  }

  removeTraveler(index: number) {
    this.travelers.splice(index, 1);
  }

  finalizeReservation() {
    console.log('Travelers:', this.travelers);
  }

  onStartDateChange() {
    if (this.startDate && this.packageDays) {
      const start = new Date(this.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + this.packageDays - 1);
      this.endDate = end.toISOString().split('T')[0];
    } else {
      this.endDate = '';
    }
  }
}
