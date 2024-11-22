import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataUploadComponent } from './metadata-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

describe('MetadataUploadComponent', () => {
  let component: MetadataUploadComponent;
  let fixture: ComponentFixture<MetadataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataUploadComponent ],
      imports: [
        HttpClientTestingModule,
        ToastModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        SkeletonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetadataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
