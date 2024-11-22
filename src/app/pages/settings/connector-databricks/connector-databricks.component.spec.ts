import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ConnectorDatabricksComponent } from './connector-databricks.component';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';

describe('ConnectorDatabricksComponent', () => {
  let component: ConnectorDatabricksComponent;
  let fixture: ComponentFixture<ConnectorDatabricksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorDatabricksComponent ],
      imports: [
        HttpClientTestingModule,
        CardModule,
        ToastModule,
        FormsModule,
        ReactiveFormsModule,
        ProgressBarModule,
        AutoCompleteModule,
        DropdownModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorDatabricksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
