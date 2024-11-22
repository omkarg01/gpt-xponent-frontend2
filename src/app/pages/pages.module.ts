import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthoriseGuard } from '../common/guards/authorise.guard';
import { SettingsComponent } from './settings/settings.component';
import { ChatService } from './chat/services/chat.service';
import { CategoryUploadComponent } from './category-upload/category-upload.component';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children:[
      {
        path:'',
        loadChildren: () => import('./search/search.module').then(m=> m.SearchModule)
      },
      {
        path:'applications',
        loadChildren: () => import('./application/application.module').then(m=> m.ApplicationModule)
      },
      {
        path:'settings',
        loadChildren: () => import('./settings/settings.module').then(m=> m.SettingsModule)
      },
      {
        path: 'content',
        loadChildren: () => import('./ppt-upload/ppt-upload.module').then(m => m.PptUploadModule) 
      },
      {
        path: 'categorization',
        component: CategoryUploadComponent 
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
      },
      {
        path: 'structure-data-analysis',
        loadChildren: () => import('./chat-databricks-agent/chat-databricks-agent.module').then(m => m.ChatDatabricksAgentModule )
      }
    ]
  }
]
@NgModule({
  declarations: [
    LayoutComponent,
    SettingsComponent,
    CategoryUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ChatService
  ]
})
export class PagesModule { }
