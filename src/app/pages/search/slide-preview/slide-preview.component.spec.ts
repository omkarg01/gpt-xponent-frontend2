import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePreviewComponent } from './slide-preview.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SafePipe } from 'src/app/common/pipe/safe.pipe';
import { DialogModule } from 'primeng/dialog';

describe('SlidePreviewComponent', () => {
  let component: SlidePreviewComponent;
  let fixture: ComponentFixture<SlidePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidePreviewComponent, SafePipe ],
      providers: [ NgbActiveModal ],
      imports: [ HttpClientTestingModule, DialogModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
