import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PptListComponent } from './ppt-list.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PptListComponent', () => {
  let component: PptListComponent;
  let fixture: ComponentFixture<PptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PptListComponent ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
