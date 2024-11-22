import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationMainComponent } from './application-main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplicationMainComponent', () => {
  let component: ApplicationMainComponent;
  let fixture: ComponentFixture<ApplicationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationMainComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, BreadcrumbModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
