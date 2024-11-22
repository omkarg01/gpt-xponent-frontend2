import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPreviewComponent } from './download-preview.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GalleriaModule } from 'primeng/galleria';

describe('DownloadPreviewComponent', () => {
  let component: DownloadPreviewComponent;
  let fixture: ComponentFixture<DownloadPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPreviewComponent ],
      providers: [ NgbActiveModal ],
      imports: [ HttpClientTestingModule, GalleriaModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
