import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizerThreeComponent } from './resizer-three.component';

describe('ResizerThreeComponent', () => {
  let component: ResizerThreeComponent;
  let fixture: ComponentFixture<ResizerThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizerThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizerThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
