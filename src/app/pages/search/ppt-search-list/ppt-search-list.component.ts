import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PptPreviewComponent } from '../ppt-preview/ppt-preview.component';

@Component({
  selector: 'app-ppt-search-list',
  templateUrl: './ppt-search-list.component.html',
  styleUrls: ['./ppt-search-list.component.scss']
})
export class PptSearchListComponent {
  @Input() data: any = '';
  @Input() rowCount: any = '';
  @Input() previewFlag: boolean = false;
  @Input() vintageCategory: any  = '';
  @Input() backFlag!: any;

  // @Output() previewClose = new EventEmitter<any>(); 
  visible!:boolean;

  constructor(private modalService: NgbModal
    ) { }
  
  preview(ppt: any){
    this.modalService.dismissAll()
    const modalRef = this.modalService.open(PptPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
    modalRef.componentInstance.data = ppt
    modalRef.componentInstance.vintageCategory = this.vintageCategory
    modalRef.componentInstance.backFlag = this.backFlag
  }
}
