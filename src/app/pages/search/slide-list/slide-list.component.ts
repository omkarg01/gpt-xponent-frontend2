import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SlidePreviewComponent } from '../slide-preview/slide-preview.component';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent {
  @Input() data: any = '';
  @Input() category: any = '';
  @Input() vintageCategory: any  = '';
  @Input() rowCount: any = '';
  @Input() previewFlag: boolean = false;
  @Output() downloadEventTrigger = new EventEmitter<any>(); 
  visible!:boolean;

  constructor(private modalService: NgbModal) { }
  
  preview(slide: any){
    this.modalService.dismissAll();
    // this.previewClose.emit()
    const modalRef = this.modalService.open(SlidePreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
    modalRef.componentInstance.data = slide
    modalRef.componentInstance.category = this.category
    modalRef.componentInstance.vintageCategory = this.vintageCategory
  }

  onClickEvent(e: any,index: any){
    e.stopPropagation();
    this.downloadEventTrigger.emit(this.data)
  }
}
