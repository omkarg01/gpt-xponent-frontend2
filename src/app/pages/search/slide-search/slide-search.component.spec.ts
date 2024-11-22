import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideSearchComponent } from './slide-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchComponent } from '../search/search.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';

describe('SlideSearchComponent', () => {
  let component: SlideSearchComponent;
  let fixture: ComponentFixture<SlideSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideSearchComponent, SearchComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SelectButtonModule,
        ToggleButtonModule,
        DialogModule,
        AutoCompleteModule,
        ToastModule,
        FormsModule,
        AccordionModule,
        SkeletonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
