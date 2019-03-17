import { TestBed } from '@angular/core/testing';

import { RoutesListService } from './routes-list.service';

describe('RoutesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutesListService = TestBed.get(RoutesListService);
    expect(service).toBeTruthy();
  });
});
