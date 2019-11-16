import { TestBed } from '@angular/core/testing';

import { BcompService } from './bcomp-service.service';

describe('BcompServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BcompService = TestBed.get(BcompService);
    expect(service).toBeTruthy();
  });
});
