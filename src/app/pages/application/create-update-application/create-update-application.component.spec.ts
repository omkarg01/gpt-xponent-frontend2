import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateApplicationComponent } from './create-update-application.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateUpdateApplicationComponent', () => {
  let component: CreateUpdateApplicationComponent;
  let fixture: ComponentFixture<CreateUpdateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateApplicationComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ButtonModule,
        DropdownModule,
        DialogModule,
        ProgressSpinnerModule,
        ToastModule,
        AccordionModule,
        OverlayPanelModule
      ],
      providers: [ MessageService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
