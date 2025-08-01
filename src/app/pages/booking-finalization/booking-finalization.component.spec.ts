import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFinalizationComponent } from './booking-finalization.component';

describe('BookingFinalizationComponent', () => {
  let component: BookingFinalizationComponent;
  let fixture: ComponentFixture<BookingFinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFinalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
