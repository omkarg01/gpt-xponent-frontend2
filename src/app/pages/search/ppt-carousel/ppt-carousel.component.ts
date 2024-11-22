import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../common/services/api.service'
import { PptPreviewComponent } from '../ppt-preview/ppt-preview.component';
@Component({
  selector: 'app-ppt-carousel',
  templateUrl: './ppt-carousel.component.html',
  styleUrls: ['./ppt-carousel.component.scss']
})
export class PptCarouselComponent implements OnInit, AfterViewInit {
  @Input() data: any = '';
  @ViewChild('pptContent', { read: ElementRef }) pptContent!: ElementRef;
  scrollLeftcount: number = 0;
  scrollRightcount: number = 0;
  visible!: boolean;
  constructor(private modalService: NgbModal,private apiService:ApiService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    if(this.pptContent.nativeElement.scrollWidth >= window.innerWidth ){
      this.scrollRightcount = 1
    }
  }

  checkEnd(e: any){
    this.scrollLeftcount = this.pptContent.nativeElement.scrollLeft;
    this.scrollRightcount = Math.round((this.pptContent.nativeElement.scrollWidth - this.pptContent.nativeElement.clientWidth) - this.pptContent.nativeElement.scrollLeft)
  }

  public scrollRight(): void {
    this.pptContent.nativeElement.scrollTo({ left: (this.pptContent.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.pptContent.nativeElement.scrollTo({ left: (this.pptContent.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

  preview(ppt: any){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(PptPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
    modalRef.componentInstance.data = ppt
    this.apiService.category.next(this.data.category)
  }

  checkVar(ppt: any){
    if(ppt !== null){
    return ppt?.length != 0 ? ppt[0].thumbnail_path : ''
    }else{
      return ''
    }
  }
}
