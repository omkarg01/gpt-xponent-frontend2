import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PptCarouselComponent } from './ppt-carousel/ppt-carousel.component';
import { PptListComponent } from './ppt-list/ppt-list.component';
import { PptPreviewComponent } from './ppt-preview/ppt-preview.component';
import { PptSearchComponent } from './ppt-search/ppt-search.component';
import { PptTopicListComponent } from './ppt-topic-list/ppt-topic-list.component';
import { SlideSearchComponent } from './slide-search/slide-search.component';
import { SlidePreviewComponent } from './slide-preview/slide-preview.component';
import { SlideListComponent } from './slide-list/slide-list.component';
import { SlideCarouselComponent } from './slide-carousel/slide-carousel.component';
import { PptSearchListComponent } from './ppt-search-list/ppt-search-list.component';
import { DownloadPreviewComponent } from './download-preview/download-preview.component';

const routes: Routes = [
  { 
    path: '', 
    component: MainPageComponent
  },
  { 
    path: 'topic/:topic', 
    component: PptTopicListComponent
  },
  { 
    path: 'ppt/:search/:viewType', 
    component: PptSearchComponent
  },
  { 
    path: 'slide/:search/:viewType', 
    component: SlideSearchComponent
  }


]

@NgModule({
  declarations: [
    SearchComponent,
    MainPageComponent,
    PptCarouselComponent,
    PptListComponent,
    PptPreviewComponent,
    PptSearchComponent,
    PptTopicListComponent,
    SlideSearchComponent,
    SlidePreviewComponent,
    SlideListComponent,
    SlideCarouselComponent,
    PptSearchListComponent,
    DownloadPreviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
