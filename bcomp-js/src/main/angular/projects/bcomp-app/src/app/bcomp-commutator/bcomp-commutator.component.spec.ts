import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcompCommutatorComponent } from './bcomp-commutator.component';

describe('BcompCommutatorComponent', () => {
  let component: BcompCommutatorComponent;
  let fixture: ComponentFixture<BcompCommutatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcompCommutatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcompCommutatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
