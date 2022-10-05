import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBenchmarkConfigsComponent } from './all-benchmark-configs.component';

describe('AllBenchmarkConfigsComponent', () => {
  let component: AllBenchmarkConfigsComponent;
  let fixture: ComponentFixture<AllBenchmarkConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBenchmarkConfigsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBenchmarkConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
