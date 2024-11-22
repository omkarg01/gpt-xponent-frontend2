import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseFileComponent } from './choose-file.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';

describe('ChooseFileComponent', () => {
  let component: ChooseFileComponent;
  let fixture: ComponentFixture<ChooseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseFileComponent ],
      imports: [ HttpClientTestingModule, ToastModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
