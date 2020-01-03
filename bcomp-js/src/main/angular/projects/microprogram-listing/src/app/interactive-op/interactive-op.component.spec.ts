import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveOpComponent } from './interactive-op.component';

describe('InteractiveOpComponent', () => {
  let component: InteractiveOpComponent;
  let fixture: ComponentFixture<InteractiveOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
