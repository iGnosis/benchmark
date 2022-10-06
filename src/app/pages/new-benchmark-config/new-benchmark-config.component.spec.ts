import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenchmarkConfigComponent } from './new-benchmark-config.component';

describe('NewBenchmarkConfigComponent', () => {
  let component: NewBenchmarkConfigComponent;
  let fixture: ComponentFixture<NewBenchmarkConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenchmarkConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBenchmarkConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
