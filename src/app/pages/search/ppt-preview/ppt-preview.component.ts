import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as Cloud from 'd3-cloud';
import { BlobStorageService } from 'src/app/common/services/blob-storage.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../common/services/api.service'
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

interface WordCloud {
  weight: number;
  word: string;
}
@Component({
  selector: 'app-ppt-preview',
  templateUrl: './ppt-preview.component.html',
  styleUrls: ['./ppt-preview.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class PptPreviewComponent implements OnInit {
  @Input() data: any = '';
  @Input() vintageCategory: any = '';
  @Input() backFlag!: any;
  relevancePptList: any = [];
  category:any;
  showthumnails: boolean = true;
  shownavigator: boolean = false;
  activeIndex: number = 0;
  private tooltip: any;
  svg: any;
  width: any = 300;
  height: any = 200;
  galleriacontainerWidth: any;
  visibleDialog!: boolean;
  loadingNext:boolean = true;
  loadingArr = Array(12).map(() => 50 * Math.random())
  cloudLoader:boolean = true;
  fontRange = [40,35,30,25,20];
  responsiveOptions: any[] = [
    {
      breakpoint: '1440px',
      numVisible: 5
    },
    {
      breakpoint: '1340px',
      numVisible: 4
    },
    {
      breakpoint: '1300px',
      numVisible: 3
    },
    {
      breakpoint: '1024px',
      numVisible: 3 
    },
    {
      breakpoint: '300px',
      numVisible: 1
    }
  ];

  chartData: WordCloud[] = [];
  isReadMore = false
  urlParam!: any; 
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private blobService:BlobStorageService,
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
      this.urlParam = this.router.url.split("/");
  }

  ngOnInit(): void {
    let width: any = window.innerWidth;
    if (width > 960) {
      if(width <= 1040){
        this.galleriacontainerWidth = {'max-width': '500px'}
      }else if(width <= 1188 && width > 1040){
        this.galleriacontainerWidth = {'max-width': '520px'}
      }else if(width <= 1310 && width > 1188){
        this.galleriacontainerWidth = {'max-width': '660px'}
      }else if(width <= 1480 && width > 1310){
        this.galleriacontainerWidth = {'max-width': '730px'}
      }else if(width <= 1720 && width > 1480){
        this.galleriacontainerWidth = {'max-width': '850px'}
      }else if(width > 1720){
        this.galleriacontainerWidth = {'max-width': '980px'}
      }
      let arr = ['pdf', 'doc', 'xls']
      if(arr.includes(this.data.file_type)){
        this.showthumnails = false
        this.shownavigator = true;
      }else if(this.data.file_type == 'img' || this.data.file_type == 'video'){
        this.showthumnails = false
        this.shownavigator = false;
      }
    }else{
      this.showthumnails = false
      this.shownavigator = true;
      this.galleriacontainerWidth = {'max-width': '600px'}
    }
    this.activeIndex = 0;
    setTimeout(() => {
      if(this.data.word_cloud?.length != undefined ){
        if(this.data.word_cloud[0].hasOwnProperty('word')){
          this.chartData = this.data.word_cloud 
          this.revoveOldContent()
          console.log("0st iteration") 
          this.wordCloud3("figure#wordcloud", 0);
        }
      }else{
        console.log("error in word cloud data")
      }
      this.cloudLoader = false
    }, 600);
    this.getListOfRelevancePPT();
  }


  closeModal(){
    this.activeModal.dismiss('Cross click')
    this.modalService.dismissAll();
  }
  
  getListOfRelevancePPT(){
    let formData: any = {"_id": this.data._id};
    // difference params based on page
    if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "topic"){ // see all page ppt preview
      formData.category = this.apiService.capitalizeFirstLetter(decodeURIComponent(this.urlParam[2]?.replace(/\+/g, ' ')));
    }else if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "ppt" && this.urlParam[3] == "default"){ // search default page ppt preview
      formData.search_term = decodeURIComponent(this.urlParam[2]?.replace(/\+/g, ' '));
      formData.type = this.urlParam[1];
    }else if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "ppt" && this.urlParam[3] == "vintage") { // search vintage page ppt preview
      formData.category = this.apiService.capitalizeFirstLetter(decodeURIComponent(this.vintageCategory?.replace(/\+/g, ' ')));
      formData.search_term = decodeURIComponent(this.urlParam[2]?.replace(/\+/g, ' '));
      formData.type = this.urlParam[1] + "_vintage";
    }else if(typeof this.urlParam[1] != 'undefined' && this.urlParam[1] == "slide"){
      formData.search_term = decodeURIComponent(this.urlParam[2]?.replace(/\+/g, ' '));
      if(this.urlParam[3] == "default"){
        formData.type = "ppt"
      }else{
        formData.type = "ppt_vintage"
        formData.category = this.apiService.capitalizeFirstLetter(decodeURIComponent(this.vintageCategory?.replace(/\+/g, ' ')));
      }
    }
    else{ // main page ppt preview
      this.apiService.category.subscribe(d => {this.category = d})
      formData.category = this.apiService.capitalizeFirstLetter(decodeURIComponent(this.category?.replace(/\+/g, ' ')))
    }
    this.apiService.getListOfRelevancePPT(formData).subscribe((d: any)=>{
      this.relevancePptList = d.files
      this.loadingNext = false
    },(err)=>{
      this.loadingNext = false
    })
  } 

  replaceHypentoBullets(str: string){
    return str?.replace(/\n-/g,'\n\n\u2022')?.replace('-','\u2022')
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  downloadMyFile(item: any){
    this.apiService.downloadURI(item.file_path,'')
  }

  revoveOldContent() {
    const myNode: any = document.getElementById("wordcloud");
    myNode.innerHTML = '';
  }

  wordCloud3(selector: any, maxFontirrationcount:  any) {
    var fill = d3.scaleOrdinal(d3.schemeCategory10);
    // List of words
    var myWords = this.chartData
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 510,
      newwidth = 510 - 50,
      height = 380;

    // append the svg object to the body of the page
    var svg = d3.select(selector).append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      // .style("background-color", '#000')
      .attr("class", "chart")
      .attr("viewBox", `0 0 ${width} ${height}`);

    var draw = (words: any) => {
      if(words?.length < myWords?.length && maxFontirrationcount < this.fontRange?.length - 1 ){
        maxFontirrationcount = maxFontirrationcount + 1
        console.log(maxFontirrationcount+"st iteration") 
        this.revoveOldContent()
        this.wordCloud3("figure#wordcloud", maxFontirrationcount);
        return;
      }
      svg
        .append("g")
        // .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-family", '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"')
        // .style("font-family", 'Open Sans')
        .style("fill", function (d, i: any) { return fill(i); })
        .attr("text-anchor", "middle")
        .text(function (d: any) { return d.text; })
        .transition()
        .duration(600)
        .style("font-size", function (d: any) { return d.size + "px"; })
        .style("font-weight", "600")
        .attr("transform", function (d: any) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        });
    }  
    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    var fontSizeScale = d3.scalePow().exponent(5).domain([0, 1]).range([12,this.fontRange[maxFontirrationcount]]);
      var layout = Cloud().size([newwidth, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.weight, fontweight: d.weight }; }))
        .padding(6)
        .rotate((d: any) => {
          let items = [0, 90];
          return items[Math.floor(Math.random()*items?.length)];
          })
        .fontSize(function (d: any) {
          let maxSize: any = d3.max(myWords, function (d) { return d.weight; });
          return fontSizeScale(d.size / maxSize);
        })
        .on("end", draw);
      layout.start();
  }

}
