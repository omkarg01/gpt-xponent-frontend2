import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { RouterModule, Routes } from '@angular/router';
import { SettingsRoutingModule } from './settings-routing.module';
import { AppSettingComponent } from './app-setting/app-setting.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { ConnectorSpComponent } from './connector-sp/connector-sp.component';
import { UsersComponent } from './users/users.component';
import { AddeditModalComponent } from './users/addedit-modal/addedit-modal.component';
import { AdUserImportModalComponent } from './users/ad-user-import-modal/ad-user-import-modal.component';
import { ConnectorDatabricksComponent } from './connector-databricks/connector-databricks.component';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent,
    children:[
      {
        path:'app',
        component: AppSettingComponent
      },
      {
        path:'connector/sp',
        component: ConnectorSpComponent
      },
      {
        path:'users',
        component: UsersComponent
      },
      {
        path:'connector/databricks',
        component: ConnectorDatabricksComponent
      },
      {
        path: '**',
        redirectTo: 'app',
        pathMatch: 'full',
      }
      
    ]
  }
]
@NgModule({
  declarations: [
    AppSettingComponent,
    ConnectorSpComponent,
    UsersComponent,
    AddeditModalComponent,
    AdUserImportModalComponent,
    ConnectorDatabricksComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    PasswordModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
