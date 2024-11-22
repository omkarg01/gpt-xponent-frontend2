import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceDetailComponent } from './workspace-detail.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MSALGuardConfigFactory, MSALInstanceFactory } from 'src/app/app.module';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('WorkspaceDetailComponent', () => {
  let component: WorkspaceDetailComponent;
  let fixture: ComponentFixture<WorkspaceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceDetailComponent ],
      imports: [ HttpClientTestingModule, ToastModule, FormsModule, ReactiveFormsModule ],
      providers: [
        MsalService,
        MsalBroadcastService,
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
