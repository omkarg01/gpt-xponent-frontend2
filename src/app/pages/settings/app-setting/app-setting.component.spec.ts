import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingComponent } from './app-setting.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';

describe('AppSettingComponent', () => {
  let component: AppSettingComponent;
  let fixture: ComponentFixture<AppSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSettingComponent ],
      imports: [
        HttpClientTestingModule,
        AccordionModule,
        ToastModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ChipsModule,
        ButtonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
