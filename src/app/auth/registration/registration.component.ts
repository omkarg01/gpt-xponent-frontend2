import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../common/services/auth.service';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MSAL_INSTANCE,  MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  regForm: UntypedFormGroup | any;
  hasadError: boolean = false;
  errMsg: string = '';
  successMsg: string = '';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingAD$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _destroying$ = new Subject<void>();
  name: any; 
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authMsalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private authService: AuthService
    ){}

  ngOnInit(): void {
      this.regForm = new UntypedFormGroup({
        username:new UntypedFormControl('', 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320)
        ]),
        email: new UntypedFormControl('', 
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320)
        ]),
        loginType: new UntypedFormControl(null, []),
      })

      this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.HANDLE_REDIRECT_END),
      )
      .subscribe((result: EventMessage) => {
        if (this.msalGuardConfig.authRequest) {
          this.authMsalService.handleRedirectObservable().subscribe({
            next: (result: AuthenticationResult) => {
              this.validateUser({username:result.account?.name,email:result.account?.username,loginType: "AD"});
               if (!this.authMsalService.instance.getActiveAccount() &&             
                  this.authMsalService.instance.getAllAccounts().length > 0) {
                     this.authMsalService.instance.setActiveAccount(result.account);
                  }
               },
            error: (error) => console.log(error)
         });
        }
      });
  
      this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.authMsalService.instance.getAllAccounts().length > 0;
  }

  submit(){
    this.validateUser(this.regForm.value);
  }

  validateUser(data: any){
    data.loginType != 'AD'? this.isLoading$.next(true): this.isLoadingAD$.next(true);
    this.authService.validateUser(data).subscribe(
      (d: any) =>{
        if(data.loginType == 'AD'){
          if(d.status){
            this.router.navigate(['/auth/signup/workspace']);
          }else{
            let user: any = this.authMsalService.instance.getActiveAccount()
            if (user != null) {
              this.name = user?.name
            }
            this.hasadError = true
          }
        }else{
          this.regForm.reset();
          this.regForm.markAsPristine();
          this.regForm.markAsUntouched();
          if(d.status){
            this.successMsg = "We have sent you account activation mail on your email."
          }else{
            this.errMsg = d.message;
          }
        }
        data.loginType != 'AD'? this.isLoading$.next(false): this.isLoadingAD$.next(false);
        console.log(d)
      },
      (err)=>{
        data.loginType != 'AD'? this.isLoading$.next(false): this.isLoadingAD$.next(false);
      });
  }

  adReg(){
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authMsalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authMsalService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authMsalService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authMsalService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authMsalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authMsalService.loginRedirect();
      }
    }
  }
}
