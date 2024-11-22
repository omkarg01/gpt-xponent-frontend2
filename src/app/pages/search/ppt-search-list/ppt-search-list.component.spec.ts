import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptSearchListComponent } from './ppt-search-list.component';

describe('PptSearchListComponent', () => {
  let component: PptSearchListComponent;
  let fixture: ComponentFixture<PptSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptSearchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PptSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
