import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaArduinoComponent } from './ruta-arduino.component';

describe('RutaArduinoComponent', () => {
  let component: RutaArduinoComponent;
  let fixture: ComponentFixture<RutaArduinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaArduinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaArduinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
