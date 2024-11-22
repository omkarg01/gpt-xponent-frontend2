import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin, interval } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExistingFileComponent } from '../existing-file/existing-file.component';
import { BlobStorageService } from 'src/app/common/services/blob-storage.service';

@Component({
  selector: 'app-chat-new',
  templateUrl: './chat-new.component.html',
  styleUrls: ['./chat-new.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ChatNewComponent implements OnInit {
  userName: any;
  uploadFlag: boolean = false;
  loadingmsg: string = '';
  progress: any = '0%'
  subTimer: any;
  percentCount = 0;
  modalRef: any;

  constructor(private router: Router, 
    private chatService: ChatService,
    private messageService: MessageService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private blobStorageService: BlobStorageService,
    private confirmationService: ConfirmationService) { }
  ngOnInit(): void {
    this.userName = localStorage.getItem('displayname')
  }
  
  // onFileChange(event: any) {
  //   if (event.target.files) {
  //     this.loadingmsg = 'Uploading...'
  //     this.uploadFlag = true;
  //     let file_name = event.target.files[0].name
  //     let uploadFileName = this.attachTimestampToFileName(file_name)
  //     const blobpath = `${environment.bloburl}/${environment.containerName}/${environment.chatContainerName}/${environment.folderName}/${uploadFileName}`;
  //     this.progress = '0%';
  //     this.uploadToBlobStorage(event.target.files[0], uploadFileName).then((d: any) => {
  //       this.loadingmsg = 'Analyzing...';
  //       this.progress = '0%';
  //       this.percentCount = 0;
  //       this.loaderCounter()
  //       forkJoin(this.chatService.chatUploadProcess(
  //         {
  //           url:blobpath,
  //           display_name: uploadFileName
  //         }),this.chatService.chatUploadPreview({url:blobpath}))
  //       .subscribe((obj: any)=>{
  //         this.subTimer.unsubscribe()
  //         this.progress = `100%`;
  //         this.chatService.newQuery.next({'_id': obj[0].chat_id, 'title':obj[0].title, 'updated_on': obj[0].updated_on,"chat_flow":obj[0].chat_flow});
  //         this.redirectPage(obj[0].chat_id) 
  //       },(err)=>{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to process file, please try again.' });
  //         this.uploadFlag = false
  //       })
  //     },
  //       (err) => {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file, please try again.' });
  //         this.uploadFlag = false
  //       })
  //   }
  // }

  attachTimestampToFileName(fileName: any) {
    const timestamp = new Date().getTime();
    const parts = fileName.split('.');
    const extension = parts.pop();
    const updatedFileName = `${parts.join('.')}_${timestamp}.${extension}`;
    return updatedFileName;
  }

  redirectPage(id: any){
    this.uploadFlag = false;
    this.loadingmsg = '';
    let objId = encodeURI(btoa(JSON.stringify(id)).toString()) 
    let type = encodeURI(btoa(JSON.stringify('local')).toString())
    this.router.navigate(['/structure-data-analysis/c/',objId,type]);
  }

  loaderCounter() {
    this.subTimer = interval(600).subscribe((val) => {
      this.percentCount ++;
      this.progress = this.percentCount + '%';
      if(this.percentCount == 96){
        this.subTimer.unsubscribe()
      }
    })
  }

  uploadToBlobStorage(content: Blob, name: string) {
    return new Promise((resolve) => {
      const blockBlobClient = this.blobStorageService.containerClient().getBlockBlobClient(`${environment.chatContainerName}/${environment.folderName}/${name}`);
      blockBlobClient.uploadData(content, {
        blockSize: 4 * 1024 * 1024, // 4MB block size
        concurrency: 20, // 20 concurrency
        onProgress: (ev) => {
          let percent = Math.round(ev.loadedBytes / content.size * 100)
          this.progress = `${percent}%`;
        }
        , blobHTTPHeaders: { blobContentType: content.type }
      })
        .then((data: any) => {
          resolve({ state: true })
        }).catch((err) => {
          resolve({ state: false })
        })
    })
  }

  chatExistingFileProcess(data: any){
    let formData = {
      table_id: data.id
    }
    this.chatService.chatExistingFileProcess(formData).subscribe((obj: any)=>{
      this.subTimer.unsubscribe()
      this.progress = `100%`;
      this.chatService.newQuery.next({'_id': obj.chat_id, 'title':obj.title, 'updated_on': obj.updated_on,"chat_flow":obj.chat_flow});
      this.redirectPage(obj.chat_id) 
    },err=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Table analysis is failed, please try again.' });
      this.uploadFlag = false;
    })
  }

  openExistingFileWindow(){
    this.modalService.open(ExistingFileComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'medium', centered: true, scrollable: true })
    .result.then((result) => {}, (reason) => {
      if(reason != 'cancel'){
        this.uploadFlag = true;
        this.loadingmsg = 'Analyzing...';
        this.progress = '0%';
        this.percentCount = 0;
        this.loaderCounter()
        this.chatExistingFileProcess(reason)
      }
    });
  }
}
