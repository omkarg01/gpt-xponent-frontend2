import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUserImportModalComponent } from './ad-user-import-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { MSALGuardConfigFactory, MSALInstanceFactory } from 'src/app/app.module';
import { TableModule } from 'primeng/table';

describe('AdUserImportModalComponent', () => {
  let component: AdUserImportModalComponent;
  let fixture: ComponentFixture<AdUserImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdUserImportModalComponent ],
      imports: [ HttpClientTestingModule, TableModule ],
      providers: [
        NgbActiveModal,
        MsalService,
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdUserImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
