import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperChatbotComponent } from './super-chatbot.component';

describe('SuperChatbotComponent', () => {
  let component: SuperChatbotComponent;
  let fixture: ComponentFixture<SuperChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperChatbotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
