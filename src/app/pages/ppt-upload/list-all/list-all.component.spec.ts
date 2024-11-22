import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllComponent } from './list-all.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';

describe('ListAllComponent', () => {
  let component: ListAllComponent;
  let fixture: ComponentFixture<ListAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAllComponent ],
      imports: [
        HttpClientTestingModule,
        ButtonModule,
        TableModule,
        DialogModule,
        GalleriaModule,
        ConfirmPopupModule,
        ToastModule,
        ProgressBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
