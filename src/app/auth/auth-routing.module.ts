import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { WorkspaceDetailComponent } from './workspace-detail/workspace-detail.component';
import { VerifyUserByEmailComponent } from './verify-user-by-email/verify-user-by-email.component';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component: RegistrationComponent
  },
  {
    path:'signup/workspace',
    component: WorkspaceDetailComponent
  },
  {
    path:'activate/:token',
    component: VerifyUserByEmailComponent
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
