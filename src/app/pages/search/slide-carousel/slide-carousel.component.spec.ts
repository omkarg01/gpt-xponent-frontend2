import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCarouselComponent } from './slide-carousel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';

describe('SlideCarouselComponent', () => {
  let component: SlideCarouselComponent;
  let fixture: ComponentFixture<SlideCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideCarouselComponent ],
      imports: [ HttpClientTestingModule, ToastModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
