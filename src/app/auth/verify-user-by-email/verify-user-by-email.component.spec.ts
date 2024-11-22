import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyUserByEmailComponent } from './verify-user-by-email.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { MSALGuardConfigFactory, MSALInstanceFactory } from 'src/app/app.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('VerifyUserByEmailComponent', () => {
  let component: VerifyUserByEmailComponent;
  let fixture: ComponentFixture<VerifyUserByEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyUserByEmailComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        MsalService,
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

    fixture = TestBed.createComponent(VerifyUserByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
