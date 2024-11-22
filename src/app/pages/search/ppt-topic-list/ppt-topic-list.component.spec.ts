import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptTopicListComponent } from './ppt-topic-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchComponent } from '../search/search.component';
import { PptSearchListComponent } from '../ppt-search-list/ppt-search-list.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';

describe('PptTopicListComponent', () => {
  let component: PptTopicListComponent;
  let fixture: ComponentFixture<PptTopicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptTopicListComponent, SearchComponent, PptSearchListComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AutoCompleteModule,
        ToastModule,
        SkeletonModule,
        FormsModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PptTopicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
