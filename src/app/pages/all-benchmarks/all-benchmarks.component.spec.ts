import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBenchmarksComponent } from './all-benchmarks.component';

describe('AllBenchmarksComponent', () => {
  let component: AllBenchmarksComponent;
  let fixture: ComponentFixture<AllBenchmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBenchmarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBenchmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
