import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/common/services/api.service';
import { DownloadPreviewComponent } from '../download-preview/download-preview.component'
@Component({
  selector: 'app-slide-search',
  templateUrl: './slide-search.component.html',
  styleUrls: ['./slide-search.component.scss']
})
export class SlideSearchComponent {
  query:string = '';
  selectQuery!: any;
  loadingArr:any = Array(4).map(() => 50 * Math.random())
  loadingNext:boolean = true;
  noMoreData:boolean = true;
  tabValue: any = 'ppt';
  vintageViewChecked: boolean = false;
  pageNumber:number = 1;
  justifyOptions: any[] = [
    { type: 'slide', justify: 'Page View' },
    { type: 'ppt', justify: 'Full View' }
  ];
  downloadList:any = []
  downloadCount: any = 0
  listData: any = []
  totalRecord!: any
  vintageListData: any= []
  visibleDialog!: boolean;

  constructor(private activatedRoute: ActivatedRoute, 
  private apiService: ApiService,
  private modalService: NgbModal,
  private router: Router
  ){
    let urlParam = this.router.url.split("/");
    this.tabValue = urlParam[1];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ viewType }) => {
      this.vintageViewChecked = viewType == 'default' ? false : true
    }); 
    this.activatedRoute.params.subscribe(({ search }) => {
      this.query = search;
      this.selectQuery = {word: this.apiService.capitalizeFirstLetter(search)}
      this.clearAll()
      if(!this.vintageViewChecked){
        this.listData = []
        this.totalRecord = 0
        this.noMoreData = false;
        this.pageNumber = 1;
        this.getSlideBySerachTerm()
      }else{
        this.loadingNext = true;
        this.listData = []
        this.totalRecord = 0

        this.getSlideBySerachTermAndVintage()
      }
    }); 
  }

  tabChange(){
    let viewType = this.vintageViewChecked ? 'vintage' : 'default';
    this.router.navigate([this.tabValue,this.query, viewType]);
  }

  viewChnage(){
    let viewType = this.vintageViewChecked ? 'vintage' : 'default';
    this.router.navigate([this.tabValue,this.query, viewType]);
  }

  getSlideBySerachTerm(){
    this.loadingNext = true;
    let formData = {"search_term": this.query,"type":this.tabValue,"page_no":this.pageNumber}
    this.apiService.getSlideBySerachTerm(formData).subscribe((d: any)=>{
      if(this.listData.length <= 0){
        this.listData = d.data;
      }else{
        this.listData = this.listData.concat(d.data);
      }
      this.loadingNext = d.loadingNext
      this.noMoreData = d.noMoreData
      this.totalRecord = d.totalRecord
    },(err)=>{
      this.loadingNext = false;
    })
  }

  getSlideBySerachTermAndVintage(pageNumber: any = 1, category: any = '',index: any = 0){
    let formData: any = {
      "search_term": this.query,
      "type":this.tabValue + "_vintage"
    }
    if(category != ''){
      formData.page_no = pageNumber
      formData.category = category
    }

    this.apiService.getSlideBySerachTermAndVintage(formData).subscribe((d: any)=>{
      if(category == ''){
        this.vintageListData = d.data
        console.log(d.data)
      }else{
        this.vintageListData[index].data = [ ...this.vintageListData[index]?.data, ...d.data[0].data];
        this.vintageListData[index].loadingNext =  d.data[0].loadingNext
        this.vintageListData[index].noMoreData = d.data[0].noMoreData;
        this.vintageListData[index].page_no = d.data[0].page_no;
      }
      this.totalRecord = d.totalRecord
      this.loadingNext = false;
    },(err)=>{
      this.loadingNext = false;
      this.vintageListData = [];
    })
  }
  
  getNext(){
    this.pageNumber = this.pageNumber + 1;
    this.getSlideBySerachTerm()
  }

  getNextVintageList(index: any){
    this.vintageListData[index].loadingNext = true
    let pageNumber = this.vintageListData[index].page_no + 1;
    this.getSlideBySerachTermAndVintage(pageNumber,this.vintageListData[index].category,index)
  }

  downloadSelectionEvent(data: any){
    if(data.selected){
      this.downloadList.length < 15 ? this.downloadList.push(data): '';
    }else{
      let index = this.downloadList.findIndex((d:any) => d.image_path == data.image_path);
      this.downloadList.splice(index, 1);
    }
    let res: any = this.downloadList.filter((d: any) => d.selected == true)
    this.downloadCount = res.length
  }

  clearAll(){
    this.downloadList = []
    this.downloadCount = 0;
  }

  showMergeDownloadPreview(){
    if(this.downloadCount > 0 ){
      this.modalService.dismissAll();
      const modalRef = this.modalService.open(DownloadPreviewComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'medium', centered: true, scrollable: true });
      modalRef.componentInstance.data = this.downloadList
      modalRef.componentInstance.clickevent.subscribe((d: any) => {
        this.downloadSlide(d)
      })
    }
  }

  downloadSlide(data: any){
    this.visibleDialog = true
    let downloadForm = data.map((d: any)=>{ return {'_id':d._id,'slide_number':d.chunk_number}})
    this.apiService.downloadSlides({'files':downloadForm}).subscribe((d: any)=>{
      this.apiService.downloadURI(d.download_path, '')
      this.visibleDialog = false
    },
    (err)=>{
      this.visibleDialog = false
    })
  }

}
