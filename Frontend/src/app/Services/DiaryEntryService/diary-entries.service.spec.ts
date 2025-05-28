import { TestBed } from '@angular/core/testing';

import { DiaryEntriesService } from './diary-entries.service';

describe('DiaryEntriesService', () => {
  let service: DiaryEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaryEntriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
