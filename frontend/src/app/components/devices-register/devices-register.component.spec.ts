import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesRegisterComponent } from './devices-register.component';

describe('DevicesRegisterComponent', () => {
  let component: DevicesRegisterComponent;
  let fixture: ComponentFixture<DevicesRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicesRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevicesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
