import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorSpComponent } from './connector-sp.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ConnectorSpComponent', () => {
  let component: ConnectorSpComponent;
  let fixture: ComponentFixture<ConnectorSpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorSpComponent ],
      imports: [
        HttpClientTestingModule,
        AccordionModule,
        ToastModule,
        BrowserAnimationsModule,
        PasswordModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorSpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
