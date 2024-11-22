import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service';

@Component({
  selector: 'app-ppt-search',
  templateUrl: './ppt-search.component.html',
  styleUrls: ['./ppt-search.component.scss']
})
export class PptSearchComponent {
  query:string = '';
  selectQuery!: any;
  loadingArr:any = Array(10).map(() => 50 * Math.random())
  loadingNext:boolean = false;
  noMoreData:boolean = true;
  tabValue: any = 'ppt';
  vintageViewChecked: boolean = false;
  pageNumber:number = 1;
  justifyOptions: any[] = [
      { type: 'slide', justify: 'Page View' },
      { type: 'ppt', justify: 'Full View' }
  ];
  listData: any = []
  totalRecord!: any
  vintageListData: any= []

  constructor(private activatedRoute: ActivatedRoute, 
  private apiService: ApiService,
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
      if(!this.vintageViewChecked){
        this.listData = []
        this.totalRecord = 0
        this.noMoreData = true;
        this.pageNumber = 1;
        this.getPPTBySerachTerm()
      }else{
        this.loadingNext = true;
        this.getPPTBySerachTermAndVintage()
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

  calculateNextPageExist = (pageSize: any, totalCount: any) => {
    // we suppose that if we have 0 items we want 1 empty page
    let totalpages = totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
    if(this.pageNumber < totalpages){
      return false;
    }else{
      return true;
    }
  };

  getPPTBySerachTerm(){
    this.loadingNext = true;
    let formData = {"search_term": this.query,"type":this.tabValue,"page_no":this.pageNumber}
    this.apiService.getPPTBySerachTerm(formData).subscribe((d: any)=>{
      if(this.listData.length <= 0){
        this.listData = d.data[0]?.files;
      }else{
        this.listData = this.listData.concat(d.data[0]?.files);
      }
      this.totalRecord = d.data[0].totalRecord
      this.noMoreData = this.calculateNextPageExist(10,this.totalRecord);
      this.loadingNext = false;
    },(err)=>{
      this.loadingNext = false;
    })
  }

  getPPTBySerachTermAndVintage(pageNumber: any = 1, category: any = '',index: any = 0){

    let formData: any = {
      "search_term": this.query,
      "type":this.tabValue + "_vintage"
    }
    if(category != ''){
      formData.page_no = pageNumber
      formData.category = category
    }

    this.apiService.getPPTBySerachTermAndVintage(formData).subscribe((d: any)=>{
      if(category == ''){
        this.vintageListData = d.data
      }else{
        this.vintageListData[index].files = [ ...this.vintageListData[index]?.files, ...d.data[0].files];
        this.vintageListData[index].loadingNext =  d.data[0].loadingNext
        this.vintageListData[index].noMoreData = d.data[0].noMoreData;
        this.vintageListData[index].page_no = d.data[0].page_no;
        console.log(this.vintageListData[index])
      }
      this.totalRecord = d.totalRecord
      this.loadingNext = false;
    },(err)=>{
      this.loadingNext = false;
      this.totalRecord = 0;
      this.vintageListData = [];
    })
  }
  
  getNext(){
    this.pageNumber = this.pageNumber + 1;
    this.getPPTBySerachTerm()
  }
  getNextVintageList(index: any){
    this.vintageListData[index].loadingNext = true
    let pageNumber = this.vintageListData[index].page_no + 1;
    this.getPPTBySerachTermAndVintage(pageNumber,this.vintageListData[index].category,index)
  }
}
