import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../common/services/api.service';
import { HeaderService } from 'src/app/common/services/header.service';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  // listData = TestConstant.actionList
  userRole = '';
  listData: any = [];
  loading:boolean = true;

  constructor(
    private apiService: ApiService,
    private headerService: HeaderService,
  ) { }

  ngOnInit(): void {
    this.getPPT()
    this.userRole = this.apiService.getRole() ?? '';
    this.headerService.setIsMobileHeaderVisibleSubject(false)
  }

  getPPT(){
    this.apiService.getPPT({}).subscribe((d: any)=>{
      this.listData = d.data;
      this.loading = false;
    },(err)=>{
      this.loading = false;
    })
  }
}
