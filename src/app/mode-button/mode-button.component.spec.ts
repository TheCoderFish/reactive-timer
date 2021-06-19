import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeButtonComponent } from './mode-button.component';

describe('ModeButtonComponent', () => {
  let component: ModeButtonComponent;
  let fixture: ComponentFixture<ModeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
