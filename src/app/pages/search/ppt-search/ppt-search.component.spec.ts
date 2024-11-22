import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptSearchComponent } from './ppt-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchComponent } from '../search/search.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';

describe('PptSearchComponent', () => {
  let component: PptSearchComponent;
  let fixture: ComponentFixture<PptSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptSearchComponent, SearchComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SelectButtonModule,
        ToggleButtonModule,
        AutoCompleteModule,
        ToastModule,
        FormsModule,
        AccordionModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PptSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
