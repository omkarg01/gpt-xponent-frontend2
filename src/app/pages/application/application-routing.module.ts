import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationMainComponent } from './application-main/application-main.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { CreateUpdateApplicationComponent } from './create-update-application/create-update-application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationMainComponent,
    children: [
      {
        path: '',
        component: ManageApplicationsComponent
      },
      {
        path: 'create',
        component: CreateUpdateApplicationComponent
      },
      {
        path: 'update/:applicationId',
        component: CreateUpdateApplicationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
