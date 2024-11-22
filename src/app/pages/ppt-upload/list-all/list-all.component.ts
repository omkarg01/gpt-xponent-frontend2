import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../common/services/api.service'
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BlobStorageService } from 'src/app/common/services/blob-storage.service';

export interface FileData {
  ppt_name: string;
  title: string;
  tags: string;
  created_on: string;
}
@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ListAllComponent implements OnInit{
  @ViewChild('dt1', { read: ElementRef, static: false }) dt1!: ElementRef<HTMLElement>;
  title!: string;
  ppt_blob_link!: any;
  images: any[] = [
    {
      previewImageSrc:"",
      previewThumbnailSrc:""
    },{
      previewImageSrc:"",
      previewThumbnailSrc:""
    },{
      previewImageSrc:"",
      previewThumbnailSrc:""
    },{
      previewImageSrc:"",
      previewThumbnailSrc:""
    }
  ];
  activeIndex:number = 0;
  showthumnails: boolean = true
  shownavigator: boolean = false
  numVisible: any
  dialogueWidth = '80%';
  allFileData: any[] = [];
  filteredFileData: any[] = [];
  visible!: boolean;
  visibleDialog!: boolean;
  filename = '';
  loading: boolean = true;
  serachStr:string  = ''
  constructor(private apiService: ApiService,
    private router: Router, 
    private messageService: MessageService,
    ){}

  ngOnInit(): void {
    if(window.innerWidth < 960){
      this.showthumnails = false
      this.shownavigator = true;
      this.dialogueWidth = '100%';
    }
    this.getAllFiles()
  }
  
  getDateFormated(utcdate: any){
    if (!utcdate) return;

    return this.apiService.getDateFormated(utcdate)
  }
  
  getAllFiles(){
    this.loading = true;
    this.apiService.getAllFiles().subscribe((d: any)=>{
      if (d?.data?.length) {
        this.filteredFileData = d?.data ?? [];
        this.allFileData = d?.data ?? [];
        this.loading = false;
      }
    },(err)=>{
      this.loading = false;
    })
  }

  downloadMyFile(item: any){
    this.apiService.downloadURI(item.file_path,'')
  }

  edit(row: any){
    if(row?.status == 'Ready'){
      let objId = encodeURI(btoa(JSON.stringify(row._id)).toString())
      this.router.navigate(['/content/edit',objId]);
    }
  }
  preview(ppt: any){
    this.images = ppt.file_preview;
    this.title = ppt.display_name;
    this.ppt_blob_link = ppt;
    this.numVisible = (ppt.file_type == 'ppt')? 4 : 2;
    this.activeIndex = 0;
    this.visible = true;
    if(ppt.file_type == 'img'){
      this.showthumnails = false
      this.shownavigator = false;
    }else{
      this.showthumnails  = true
      this.shownavigator = false
    }
  }

  deletePPTFile(row: any){
    if(row?.status == 'Ready'){
    this.apiService.deleteMetaData({_id: row._id}).subscribe((d)=>{
      this.getAllFiles()
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File and data deleted successfully!' });
    },(err)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong! failed to delete file and data' });
    })
  }
  }

  searchItem(e: any){
    this.serachStr = e.target.value;
  }

  uploadNew(){
    this.router.navigate(['/content/new']);
  }

  filterFileData = (event: any) => {
    const searchTerm = event?.filters?.global?.value?.toLowerCase() ?? '';

    this.filteredFileData = this.allFileData.filter(obj => {
      return (
        obj?.file_name?.toLowerCase()?.includes(searchTerm) ||
        obj?.file_title?.toLowerCase()?.includes(searchTerm) ||
        obj?.file_source?.toLowerCase()?.includes(searchTerm) ||
        obj?.status?.toLowerCase()?.includes(searchTerm)
      )
    })
  }

  sortFileData = (event: any) => {
    const { field, order } = event;
    
    this.filteredFileData = this.allFileData.filter(obj => {
      return (
        obj?.file_name?.toLowerCase()?.includes(this.serachStr) ||
        obj?.file_title?.toLowerCase()?.includes(this.serachStr) ||
        obj?.file_source?.toLowerCase()?.includes(this.serachStr) ||
        obj?.status?.toLowerCase()?.includes(this.serachStr)
      )
    }).sort((a, b) => {
      let val1 = null, val2 = null;

      if (field === 'uploaded_on') {
        // for sorting dates
        val1 = new Date(a?.[field])?.getTime() ?? 0;        
        val2 = new Date(b?.[field])?.getTime() ?? 0;
      } else {
        // for sorting strings
        val1 = a?.[field]?.toLowerCase() ?? '';
        val2 = b?.[field]?.toLowerCase() ?? '';
      }
      console.log("inside sort")
      if (order === 1) {
        // for ASC sorting
        if (val1 > val2) {
          return 1;
        } else if (val1 < val2) {
          return -1;
        }
      } else if (order === -1) {
        // for DESC sorting
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        }
      } else {
        return order;
      }
    })
  }

  lazyLoadFileData = (event: LazyLoadEvent) => {
    if (event.first && event.rows && event.forceUpdate) {
      const loadedFiles = this.allFileData.slice(event.first, event.first + event.rows);

      Array.prototype.splice.apply(
        this.filterFileData,
        // @ts-ignore
        [...[this.startIndex, event.rows], ...loadedFiles]
      )

      event.forceUpdate();
    }
  }
}
