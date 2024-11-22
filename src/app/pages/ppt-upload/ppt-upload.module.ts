import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ChooseFileComponent } from './choose-file/choose-file.component';
import { MetadataUploadComponent } from './metadata-upload/metadata-upload.component';
import { ListAllComponent } from './list-all/list-all.component';

const routes: Routes = [
  { 
    path: 'new', 
    component: ChooseFileComponent
  },
  {
    path: 'new/:id',
    component: MetadataUploadComponent
  },
  {
    path: 'edit/:id',
    component: MetadataUploadComponent
  },
  {
    path: 'list',
    component: ListAllComponent
  }

]

@NgModule({
  declarations: [
    ChooseFileComponent,
    MetadataUploadComponent,
    ListAllComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PptUploadModule { }
