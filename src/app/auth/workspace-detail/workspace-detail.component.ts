import { Component } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalGuardConfiguration } from '@azure/msal-angular';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../common/services/auth.service';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html',
  styleUrls: ['./workspace-detail.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class WorkspaceDetailComponent {
  tenantForm: UntypedFormGroup | any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subject = new Subject();
  validName = true;
  errorworkspaceMsg = '';
  successworkspaceMsg = '';
  loader = false
  constructor(
    private authMsalService: MsalService,
    private authService: AuthService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    private messageService: MessageService,
  ) { 

  }

  ngOnInit(): void {
    this.tenantForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required]),
      loginType: new UntypedFormControl('', []),
      workspace: new UntypedFormControl('', [Validators.required,Validators.minLength(3),
        Validators.maxLength(60),Validators.pattern('^[a-z0-9-]+$')
      ]),
    })

    let user: any;
    user = this.authMsalService.instance.getActiveAccount()
    console.log(user)
    if (user != null) {
      this.tenantForm.get('username').setValue(user?.name)
      this.tenantForm.get('email').setValue(user?.username)
      this.tenantForm.get('loginType').setValue('AD')
    } else {
      this.authService.verifiedUserData.subscribe((d) => {
        this.tenantForm.get('username').setValue(d?.username)
        this.tenantForm.get('email').setValue(d?.email)
        this.tenantForm.get('loginType').setValue('manual')
      })
    }
    this.subject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((d) => {
      this.authService.uniqueWorkspace(d).subscribe((data: any) => {
        if (data.status) {
          this.errorworkspaceMsg = '';
          this.successworkspaceMsg = 'The workspace name <b>'+ d +'</b> is available';
          this.validName = false;
        } else {
          this.errorworkspaceMsg = 'The workspace name <b>'+ d +'</b> is not available';
          this.successworkspaceMsg = '';
          this.validName = true;
        }
      },
      (err)=>{
        this.errorworkspaceMsg = 'The workspace name <b>'+ d +'</b> is not available';
        this.successworkspaceMsg = '';
        this.validName = true;
      })
    });
  }

  checkVal(e: any) {
    this.validName = false;
    this.errorworkspaceMsg = '';
    if (e?.target.value.length >= 3) {
      this.subject.next(e?.target.value);
    }else{
      this.validName = true;
    }
  }

  submit() {
    this.loader = true
    this.authService.workspaceRegistration(this.tenantForm.value).subscribe((data: any) => {
      if(this.tenantForm.get('loginType').value == "AD"){
        this.messageService.add({ severity: 'success', summary: 'Success',life: 5000, detail: 'Thank you for registering with AIXPONENT! We are committed to providing you with an outstanding solution and a positive experience.' });
        setTimeout(() => {this.router.navigate(['/auth/login']);}, 5000);    
      }else{
        this.messageService.add({ severity: 'success', summary: 'Success',life: 7000, detail: 'Thanks!! We have send the login details on your email ID, please check your mail to continue to login.' });
        setTimeout(() => { this.router.navigate(['/auth/login']);}, 7000);        
      }
    },
    (err)=>{
      this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Something went wrong, please try again after sometime .' });
      setTimeout(() => { this.router.navigate(['/auth/signup']);}, 5000); 
    })
  }
}

