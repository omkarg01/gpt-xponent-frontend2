import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PptPreviewComponent } from '../ppt-preview/ppt-preview.component';
@Component({
  selector: 'app-ppt-list',
  templateUrl: './ppt-list.component.html',
  styleUrls: ['./ppt-list.component.scss']
})
export class PptListComponent {
  @Input() data: any = '';
  @Input() rowCount: any = '';
  @Input() previewFlag: boolean = false;
  @Input() vintageCategory: any  = '';
  @Input() backFlag!: any;

  // @Output() previewClose = new EventEmitter<any>(); 
  visible!:boolean;

  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal
    ) { }
  
  preview(ppt: any){
    this.activeModal.dismiss('Cross click')
    const modalRef = this.modalService.open(PptPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
    modalRef.componentInstance.data = ppt
    modalRef.componentInstance.vintageCategory = this.vintageCategory
    modalRef.componentInstance.backFlag = this.backFlag
  }
}
