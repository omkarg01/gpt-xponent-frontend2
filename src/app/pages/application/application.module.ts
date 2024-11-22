import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationMainComponent } from './application-main/application-main.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { CreateUpdateApplicationComponent } from './create-update-application/create-update-application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    ApplicationMainComponent,
    ManageApplicationsComponent,
    CreateUpdateApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModule,
  ],
  providers: [
    MessageService
  ]
})
export class ApplicationModule { }
