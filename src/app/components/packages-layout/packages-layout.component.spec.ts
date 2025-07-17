import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesLayoutComponent } from './packages-layout.component';

describe('PackagesLayoutComponent', () => {
  let component: PackagesLayoutComponent;
  let fixture: ComponentFixture<PackagesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackagesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
