import { TestBed } from '@angular/core/testing';

import { BCompService } from './bcomp.service';

describe('BcompServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BCompService = TestBed.get(BCompService);
    expect(service).toBeTruthy();
  });
});
