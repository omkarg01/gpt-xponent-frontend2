import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../common/services/auth.service';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MSAL_INSTANCE,  MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: UntypedFormGroup | any;
  errMsg: string = '';
  hasadError: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingAD$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  name: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authMsalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private authService: AuthService
    ){}
  
  ngOnInit(): void {
      this.loginForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      loginType: new UntypedFormControl(null, []),
    })
    if(localStorage.getItem('LoginStart') != '1'){
      console.log("inside")
    }
    console.log("getActiveAccount",this.authMsalService.instance.getActiveAccount())
    console.log(this.authMsalService.instance.getActiveAccount() !== null &&             
    this.authMsalService.instance.getAllAccounts().length > 0)

    this.authMsalService.instance.handleRedirectPromise().then((result) => {
      console.log("Process redirect after login and handle the response ")
      this.msalBroadcastService.msalSubject$
      .pipe(
        // Optional filtering of events.
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS), 
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log("In EventType.LOGIN_SUCCESS ")
        if (this.msalGuardConfig.authRequest) {
          this.authMsalService.handleRedirectObservable().subscribe({
            next: (result: AuthenticationResult) => {
              console.log("LOGIN_SUCCESS result",result)
              this.login({username:result.account.username,loginType: "AD"})
                this.setActiveAccount()
              },
            error: (error) => console.log(error)
         });
        }
      });
  
      this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.HANDLE_REDIRECT_END),
      )
      .subscribe((result: EventMessage) => {
        console.log("In HANDLE_REDIRECT_END ")
        if (this.msalGuardConfig.authRequest) {
          this.authMsalService.handleRedirectObservable().subscribe({
            next: (result: AuthenticationResult) => {
              console.log("HANDLE_REDIRECT_END result",result)
               if (!this.authMsalService.instance.getActiveAccount() &&             
                  this.authMsalService.instance.getAllAccounts().length > 0) {
                    console.log("inside login call")
                    this.login({username:result.account.username,loginType: "AD"})
                    this.setActiveAccount()
                  }
               },
            error: (error) => console.log(error)
         });
        }
      });

    }).catch(error => {
      console.error(error);
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

  userLogin(){
    this.login(this.loginForm.value)
  }


  setActiveAccount() {
    const accounts = this.authMsalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.authMsalService.instance.setActiveAccount(accounts[0]);
    }
  }
  login(data: any){
    data.loginType != 'AD'? this.isLoading$.next(true): this.isLoadingAD$.next(true);
    this.authService.userLogin(data).subscribe(
      (d: any) =>{
        if(data.loginType == 'AD'){
          if(d.status == false){
            let user: any = this.authMsalService.instance.getActiveAccount()
            if (user != null) {
              this.name = user?.name
            }
            this.hasadError = true;
          }else{
            if(this.authMsalService.instance.getActiveAccount() != null){
              this.authService.setauthParams(d,0)
            }
          }
        }else{
          this.errMsg = '';
          this.isLoading$.next(false)
          this.authService.setauthParams(d,1)
        }
      },
      (err)=>{
        if(data.loginType == 'AD'){
          this.isLoadingAD$.next(false)
          this.authMsalService.instance.setActiveAccount(null)
        }else{
          this.isLoading$.next(false);
        }
        if(err.status == 401){
          this.errMsg = err.error.message
        }else{
          this.errMsg = "Something went wrong";
        }
        
      });
  }

  userSignup(){
    this.router.navigate(['/auth/signup/workspace']);
  }

  adlogin() {
    localStorage.setItem('LoginStart','1')
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
