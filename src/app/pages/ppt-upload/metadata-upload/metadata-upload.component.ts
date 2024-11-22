import { Component, HostListener, OnInit } from '@angular/core';
import { BlobStorageService } from '../../../common/services/blob-storage.service'
import { ApiService } from '../../../common/services/api.service'
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
@Component({
  selector: 'app-metadata-upload',
  templateUrl: './metadata-upload.component.html',
  styleUrls: ['./metadata-upload.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class MetadataUploadComponent implements OnInit{
  metadataForm: UntypedFormGroup | any;
  progressFlag: boolean = true;
  objId!: any;
  metaData!: any;
  formType: any;
  visible!: boolean;
  images!: any[];
  flagdisable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  iswindowfullscreen: boolean = false
  showthumnails: boolean = true
  shownavigator: boolean = false
  previewdisplaybox = 'flex !important'
  previewBox = '0 0 50%';
  formBox = '0 0 50%';
  isMobilescreen: boolean = true;
  recommendationList: any = [];
  private unsubscribe: Subscription[] = [];


  responsiveOptions: any[] = [
    {
      breakpoint: '1480px',
      numVisible: 4
    },
    {
      breakpoint: '1320px',
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
  galleriacontainerWidth: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
      private apiService: ApiService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private router: Router){
        let decodedparam = this.router.url.split("/");
        this.formType = decodedparam[2];
        this.objId = decodedparam[3] ?
          JSON.parse(atob(decodeURIComponent(decodedparam[3]))) : '';
      }
  ngOnInit(): void {
    let width: any = window.innerWidth;
    if (width > 960) {
      if(width <= 1040){
        this.galleriacontainerWidth = {'max-width': '480px'}
      }else if(width <= 1188 && width > 1040){
        this.galleriacontainerWidth = {'max-width': '520px'}
      }else if(width <= 1310 && width > 1188){
        this.galleriacontainerWidth = {'max-width': '580px'}
      }else if(width <= 1480 && width > 1310){
        this.galleriacontainerWidth = {'max-width': '650px'}
      }else if(width <= 1720 && width > 1480){
        this.galleriacontainerWidth = {'max-width': '760px'}
      }else if(width > 1720){
        this.galleriacontainerWidth = {'max-width': '870px'}
      }
    }else{
      this.showthumnails = false
      this.shownavigator = true;
      this.previewBox = '0 0 100%';
      this.formBox = '0 0 100%';
      this.isMobilescreen = false
      this.galleriacontainerWidth = {'max-width': '600px'}
    }
    this.getMetaData()
    this.metadataForm = new UntypedFormGroup({
      display_name: new UntypedFormControl('', [Validators.required]),
      file_title: new UntypedFormControl('', [Validators.required]),
      file_summary: new UntypedFormControl('', [Validators.required]),
      edit_flag: new UntypedFormControl('', [Validators.required]),
      tags: new UntypedFormControl([], [Validators.required]),
      file_entities: new UntypedFormArray([this.createNewGrp()]),
      file_dictionary: new UntypedFormArray(this.formType == 'new'? [this.createNewGrp()]:[]),
    }) 
  }


  fullScreen(flag: boolean){
    this.iswindowfullscreen = flag;
    if(flag){
      this.previewBox = '0 0 0%' 
      this.formBox = '0 0 100%' 
      this.previewdisplaybox = 'none !important'
    }else{
      this.previewBox = '0 0 50%' 
      this.formBox = '0 0 50%' 
      this.previewdisplaybox = 'flex !important'
    }
  }
  private createNewGrp(): UntypedFormGroup {
    return new UntypedFormGroup({
      word: new UntypedFormControl('', []),
      label: new UntypedFormControl([], []),
    });
  }
  public addNewGrp(control: any) {
    const rowsArray = this.metadataForm.get(control) as UntypedFormArray
    rowsArray.push(this.createNewGrp())
  }

  public removeOrClearGrp(control: any, i: number) {
    const rowsArray = this.metadataForm.get(control) as UntypedFormArray
    if (rowsArray.length > 1) {
      rowsArray.removeAt(i)
    } else {
      rowsArray.clear()
    }
  }

  getMetaData(){
    this.apiService.getMetaData({_id:this.objId}).subscribe((d: any)=>{
      this.metaData = d.data;
      let arr = ['pdf', 'doc', 'xls']
      if(arr.includes(d.data.file_type)){
        this.showthumnails = false
        this.shownavigator = true;
      }else if(d.data.file_type == 'img' || d.data.file_type == 'video'){
        this.showthumnails = false
        this.shownavigator = false;
      }
      this.images = d.data.file_preview;
      let tags: any = []
      d.data.tags.forEach((element: any, index: any) => {
        tags.push(element.word)
      })
      this.recommendationList = this.metaData.suggestions.filter(function(item: any) {
        return !tags.includes(item)
      });
      this.setFields()

    },(err)=>{
      this.progressFlag = false
    })
  }

  setFields(){
    this.metadataForm.get('display_name').setValue(this.metaData.display_name)
    this.metadataForm.get('file_title').setValue(this.metaData.file_title)
    this.metadataForm.get('file_summary').setValue(this.metaData.file_summary)
    this.metadataForm.get('tags').setValue(this.metaData.tags)
    this.metadataForm.get('edit_flag').setValue(1)
    const rowsfile_entities = this.metadataForm.get('file_entities') as UntypedFormArray
    if(this.metaData.file_entities?.length > 0){
      rowsfile_entities.clear()
      this.metaData.file_entities.forEach((element: any, index: any) => {
        this.addNewGrp('file_entities')
        rowsfile_entities.at(index).get('word')?.setValue(element.word)
        rowsfile_entities.at(index).get('label')?.setValue(element.label)
      });
    }

    const file_dictionary = this.metadataForm.get('file_dictionary') as UntypedFormArray
    if(this.metaData.file_dictionary.length > 0){
      file_dictionary.clear()
      this.metaData.file_dictionary.forEach((element: any, index: any) => {
        this.addNewGrp('file_dictionary')
        file_dictionary.at(index).get('word')?.setValue(element.word)
        file_dictionary.at(index).get('label')?.setValue(element.label)
      });
    }
    this.progressFlag = false
  }

  addTag(tag: any,i: any){
    let currentTag: any =  this.metadataForm.get('tags').value
    currentTag.push({word: tag, weight: 1})
    this.metadataForm.get('tags').setValue(currentTag)
    this.recommendationList = this.recommendationList.filter(function(item: any) {
      return item !== tag
    });
  }

  callMe(e:any){
    let res = this.metadataForm.get('tags').value.map((d: any)=>{
      if(typeof d == "object"){
        return d
      }else{
        return {word: d,weight: 1}
      }
    })
    this.metadataForm.get('tags').setValue(res)
  }

  reSetTags(e: any){
    if(this.metaData.suggestions.includes(e.word) && !this.recommendationList.includes(e.word)){
      this.recommendationList = this.metaData.suggestions.filter((item: any) => {
        if(this.recommendationList.includes(item)) {
          return item
        }else if(item == e.word){
          return item
        }
      });
    }
  }

  saveMetadata(){
    this.isLoading$.next(true)
    // const submitVal = this.formType == 'new'? 
    // combineLatest([this.apiService.saveMetaData({_id:this.objId,data: this.metadataForm.value}),this.apiService.categorizePPT({_id: this.objId})]) 
    // : this.apiService.saveMetaData({_id:this.objId,data: this.metadataForm.value});
    
    this.apiService.saveMetaData({_id:this.objId,data: this.metadataForm.value}).subscribe((obj: any)=>{
      this.isLoading$.next(false)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File information added successfully' });
      setTimeout(() => {
        this.router.navigate(['/content/list']);
      }, 1000);
    },(err)=>{
      this.isLoading$.next(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save data, try again after sometime.' });
    })
  }

  delete() {
    this.confirmationService.confirm({
        message: 'If you cancel, the file will be deleted permanently, and you will lose the data. Do you wish to continue?',
        header: 'Are you sure you want to cancel ?',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.flagdisable.next(true)
          this.apiService.deleteMetaData({_id: this.objId}).subscribe((d)=>{
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File and data deleted successfully!' });
            this.router.navigate(['/content/new']);
          },(err)=>{
            this.flagdisable.next(false)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong! failed to delete file and data' });
          })
        },
        reject: (type: any) => {
        }
    });
  }
  redirectToListing(){
    this.confirmationService.confirm({
      message: 'Any unsaved changes will be lost. Would you like to continue ?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.router.navigate(['/content/list'])
      },
      reject: (type: any) => {

      }
    });
    
  }
}
