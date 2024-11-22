import { TestBed } from '@angular/core/testing';

import { AuthoriseGuard } from './authorise.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { MSALGuardConfigFactory, MSALInstanceFactory } from 'src/app/app.module';

describe('AuthoriseGuard', () => {
  let guard: AuthoriseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
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
    });
    guard = TestBed.inject(AuthoriseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
