import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcompAluComponent } from './b-comp-alu.component';

describe('BcompAluComponent', () => {
  let component: BcompAluComponent;
  let fixture: ComponentFixture<BcompAluComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcompAluComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcompAluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
