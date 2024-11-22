import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PasswordModule } from 'primeng/password';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SignupComponent } from './redirection/signup/signup.component';
import { SigninComponent } from './redirection/signin/signin.component';
import { TenantActivationComponent } from './redirection/tenant-activation/tenant-activation.component';
import { Footer1Component } from '../common/components/footer/footer1/footer1.component';
import { WorkspaceDetailComponent } from './workspace-detail/workspace-detail.component';
import { VerifyUserByEmailComponent } from './verify-user-by-email/verify-user-by-email.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    SignupComponent,
    SigninComponent,
    TenantActivationComponent,
    Footer1Component,
    WorkspaceDetailComponent,
    VerifyUserByEmailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PasswordModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
