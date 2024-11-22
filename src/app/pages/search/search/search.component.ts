import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class SearchComponent {
  @Input() query!:any; 
  @Input() type:any = 'ppt'; 
  @Input() vintageView!:any; 
  selectedQuery!: any;
  pptspreserved: any[] = [];
  history!: any[];
  filteredKeyword!: any[]

  constructor(private router: Router, 
    private apiService: ApiService, 
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService){ 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ search }) => {
      this.getHistoryRecommendation()
    })
    this.selectedQuery = this.query
  }

  getHistoryRecommendation(){
    let formData = {}
    this.apiService.getHistoryRecommendation(formData).subscribe((d: any)=>{
      this.history = d.search_history
      this.pptspreserved = d.search_recommendations
    },(err)=>{

    })
  }

  filterKeyword(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    if(event.query == ''){
      for (let i = 0; i < this.history.length; i++) {
        if (this.history[i].word.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(this.history[i]);
        }
      }
    }else{
      for (let i = 0; i < this.pptspreserved.length; i++) {
        if (this.pptspreserved[i].word.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(this.pptspreserved[i]);
        }
      }
    }
    this.filteredKeyword = filtered;
  }
  
  onKeyUpSearch(e: any){
    if ((e.key === 'Enter' || e.keyCode === 13) && typeof this.selectedQuery != 'undefined') {
      this.searchKeyword(this.selectedQuery)
    }
  }
  onSelectSearch(){
    this.searchKeyword(this.selectedQuery.word)
  }

  searchKeyword(query: string){
    let querytext = query.toLowerCase().replace(/[^a-z0-9]/gi, '');
    console.log(querytext)
    if(querytext != ''){
      let viewType = this.vintageView ? 'vintage' : 'default';
      this.router.navigate([this.type,query.toLowerCase(),viewType]);
    }else{
      this.selectedQuery = "";
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! Invalid Search Term.' });
    }
  }
}