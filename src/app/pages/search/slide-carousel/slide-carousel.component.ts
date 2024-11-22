import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../common/services/api.service'
import { PptPreviewComponent } from '../ppt-preview/ppt-preview.component';
import { SlidePreviewComponent } from '../slide-preview/slide-preview.component';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-slide-carousel',
  templateUrl: './slide-carousel.component.html',
  styleUrls: ['./slide-carousel.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class SlideCarouselComponent implements OnInit, AfterViewInit{
  @Input() data: any = '';
  @Input() vintageCategory: any  = '';
  @Output() downloadEventTrigger = new EventEmitter<any>(); 
  @ViewChild('slideContent', { read: ElementRef }) slideContent!: ElementRef;
  scrollLeftcount: number = 0;
  scrollRightcount: number = 0;
  visible!: boolean;
  urlParam!: any;
  downloadCount: any;
  constructor(private modalService: NgbModal,
    private apiService:ApiService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { 
      this.urlParam = this.router.url.split("/");
    }

  ngOnInit(): void {
  }
  @Input('downloadCount')
  set name(downloadCount: any) {
    this.downloadCount = downloadCount
    if(downloadCount == 0){
        this.data.files.forEach((e: any,i: any) => {
          e.selected = false
        });
    }
  }

  ngAfterViewInit(){
    if(this.slideContent.nativeElement.scrollWidth >= window.innerWidth ){
      this.scrollRightcount = 1
    }
  }

  checkEnd(e: any){
    this.scrollLeftcount = this.slideContent.nativeElement.scrollLeft;
    this.scrollRightcount = Math.round((this.slideContent.nativeElement.scrollWidth - this.slideContent.nativeElement.clientWidth) - this.slideContent.nativeElement.scrollLeft)
  }

  public scrollRight(): void {
    this.slideContent.nativeElement.scrollTo({ left: (this.slideContent.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.slideContent.nativeElement.scrollTo({ left: (this.slideContent.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

  preview(slide: any){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(SlidePreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
    modalRef.componentInstance.data = slide
    console.log(this.data?.display_name)
    modalRef.componentInstance.category = this.data?.display_name
    modalRef.componentInstance.vintageCategory = this.vintageCategory
  }

  pptpreview(id: any){
    this.apiService.getPPTById({"_id":id, search_term: decodeURIComponent(this.urlParam[2].replace(/\+/g, ' '))}).subscribe((d: any)=>{
      this.modalService.dismissAll();
      const modalRef = this.modalService.open(PptPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
      modalRef.componentInstance.data = d.data
      modalRef.componentInstance.vintageCategory = this.vintageCategory
    },(err)=>{
      
    })

  }

  onClickEvent(e: any,index: any){
    e.stopPropagation();
    setTimeout(() => {
      this.downloadEventTrigger.emit(this.data.files[index])
      let count = this.data.files[index].selected == true ? this.downloadCount + 1 : this.downloadCount
      if(count >= 16){
        this.data.files[index].selected = false;
        this.messageService.add({ severity: 'error', summary: 'Warning!', detail: 'You have exceeded maximum selection.' });
      }
    }, 50);
  }
}
