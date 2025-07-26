import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPackagesComponent } from './travel-packages.component';

describe('TravelPackagesComponent', () => {
  let component: TravelPackagesComponent;
  let fixture: ComponentFixture<TravelPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
