import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantActivationComponent } from './tenant-activation.component';

describe('TenantActivationComponent', () => {
  let component: TenantActivationComponent;
  let fixture: ComponentFixture<TenantActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
