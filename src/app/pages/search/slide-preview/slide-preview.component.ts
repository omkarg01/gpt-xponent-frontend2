import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/common/services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PptPreviewComponent } from '../ppt-preview/ppt-preview.component';

@Component({
  selector: 'app-slide-preview',
  templateUrl: './slide-preview.component.html',
  styleUrls: ['./slide-preview.component.scss']
})
export class SlidePreviewComponent {
  @Input() data: any = '';
  @Input() category: any = '';
  @Input() vintageCategory: any = '';
  urlParam!: any;
  loadingNext:boolean = false;
  relevanceSlideList: any = [];
  loadingArr = Array(12).map(() => 50 * Math.random())
  visibleDialog!: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal,
  ) {
      
  }
  ngOnInit(): void {
    this.urlParam = this.router.url.split("/");
    this.getListOfRelevanceSlides()
  }

  getListOfRelevanceSlides(){
    this.loadingNext = true;
    let formData: any = {"_id": this.data._id,"slide_number":this.data.chunk_number};
    if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "slide" && this.urlParam[3] == "default"){
      formData.search_term = decodeURIComponent(this.urlParam[2].replace(/\+/g, ' '));
      formData.type = this.urlParam[1];
      formData.category = decodeURIComponent(this.category.replace(/\+/g, ' '));
    }else if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "slide" && this.urlParam[3] == "vintage") {
      formData.category = this.apiService.capitalizeFirstLetter(decodeURIComponent(this.vintageCategory.replace(/\+/g, ' ')));
      formData.search_term = decodeURIComponent(this.urlParam[2].replace(/\+/g, ' '));
      formData.type = this.urlParam[1] + "_vintage";
    }
    
    this.apiService.getListOfRelevanceSlides(formData).subscribe((d: any)=>{
      this.relevanceSlideList = d.files
      this.loadingNext = false
    },(err)=>{
      this.loadingNext = false
    })
  } 

  pptpreview(id: any){
    this.apiService.getPPTById({"_id":id, search_term: decodeURIComponent(this.urlParam[2].replace(/\+/g, ' '))}).subscribe((d: any)=>{
      const modalRef = this.modalService.open(PptPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'giant', centered: true, scrollable: true });
      modalRef.componentInstance.data = d.data
      modalRef.componentInstance.vintageCategory = this.vintageCategory
      modalRef.componentInstance.backFlag = true
    },(err)=>{
      
    })
  }

  downloadSlide(){
    this.visibleDialog = true
    let downloadForm = [{'_id':this.data._id,'slide_number':this.data.chunk_number,'slide_title':this.data.chunk_title}]
    this.apiService.downloadSlides({'files':downloadForm,"single":true}).subscribe((d: any)=>{
      this.apiService.downloadURI(d.download_path, '')
      this.visibleDialog = false
    },
    (err)=>{
      this.visibleDialog = false
    })
  }
}
