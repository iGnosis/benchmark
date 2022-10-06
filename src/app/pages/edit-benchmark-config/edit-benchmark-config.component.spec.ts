import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBenchmarkConfigComponent } from './edit-benchmark-config.component';

describe('EditBenchmarkConfigComponent', () => {
  let component: EditBenchmarkConfigComponent;
  let fixture: ComponentFixture<EditBenchmarkConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBenchmarkConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBenchmarkConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
