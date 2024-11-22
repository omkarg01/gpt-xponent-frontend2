import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service';

@Component({
  selector: 'app-ppt-topic-list',
  templateUrl: './ppt-topic-list.component.html',
  styleUrls: ['./ppt-topic-list.component.scss']
})
export class PptTopicListComponent implements OnInit{
  topicName:string = '';
  listData:any = [];
  loadingArr:any = Array(10).map(() => 50 * Math.random())
  loadingNext:boolean = true;
  pageNumber:number = 1;
  noMoreData:boolean = false;
  constructor(private router: Router,private activatedRoute: ActivatedRoute, private apiService: ApiService){}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ topic }) => {
      this.topicName = decodeURIComponent(topic.replace(/\+/g, ' '));
    });
    this.getPPTByCategory()
  }

  getNext(){
    this.pageNumber = this.pageNumber + 1;
    this.getPPTByCategory()
  }

  getPPTByCategory(){
    this.loadingNext = true;
    let formData = {"category":this.apiService.capitalizeFirstLetter(this.topicName),"page_no":this.pageNumber}
    this.apiService.getPPTByCategory(formData).subscribe((d: any)=>{
      if(this.listData.length <= 0){
        this.listData = d.data[0]?.files;
      }else{
        this.listData = this.listData.concat(d.data[0]?.files);
      }
      this.noMoreData = d.data[0]?.files.length < 10 ? true : false;
      this.loadingNext = false;
    },(err)=>{
      this.loadingNext = false;
    })
  }

}
