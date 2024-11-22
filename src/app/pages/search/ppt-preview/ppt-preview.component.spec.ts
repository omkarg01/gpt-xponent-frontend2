import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptPreviewComponent } from './ppt-preview.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

describe('PptPreviewComponent', () => {
  let component: PptPreviewComponent;
  let fixture: ComponentFixture<PptPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptPreviewComponent ],
      providers: [ NgbActiveModal ],
      imports: [
        HttpClientTestingModule,
        GalleriaModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        SkeletonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PptPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
