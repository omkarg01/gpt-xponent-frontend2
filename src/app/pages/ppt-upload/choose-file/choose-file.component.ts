import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, interval, last, merge, tap } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
import { BlobStorageService } from '../../../common/services/blob-storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ChooseFileComponent implements OnInit {
  uploadFlag: boolean = false;
  loadingmsg: string = '';
  res!: any
  progress: any = '0%'
  sub: any;
  subTimer: any;
  previewStatus = false;
  percentCount = 0;
  counterRandNumber = this.randomIntFromInterval(22,27)
  counter = this.counterRandNumber;
  constructor(
    private router: Router, 
    private apiService: ApiService, 
    private blobService: BlobStorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}
  ngOnInit(): void {}

  async onFileChange(event: any){
    if (event.target.files) {
      this.loadingmsg = 'Uploading file ....'
      this.uploadFlag = true;
      let file_name = event.target.files[0].name 
      const blobpath =
        `${environment.bloburl}/${environment.containerName}/${environment.folderName}/${file_name}`;
      this.progress = '0%';
      console.log(this.progress)
      this.apiService.create({path:blobpath,display_name:file_name}).subscribe((d: any)=>{
        let id = d._id;
        forkJoin([this.uploadToBlobStorage(event.target.files[0],file_name)]).subscribe((d: any)=>{
          this.loadingmsg = 'Processing file ....';
          this.progress = '0%';
          this.percentCount = 0;
          this.counterRandNumber = this.randomIntFromInterval(22,27)
          this.counter = this.counterRandNumber;
          this.checkCounter()
          console.log(this.progress)
          merge(this.apiService.processfirst({_id: id}),this.apiService.preview({_id: id}))
          .subscribe((obj: any)=>{
            this.counterRandNumber = this.randomIntFromInterval(this.counterRandNumber,this.counterRandNumber + 7)
            this.counter  = this.counter + this.counterRandNumber
            this.checkCounter()
            console.log(this.progress)
              if(obj.message == "File processed successfully."){
                this.apiService.processsecond({_id: id}).subscribe((p: any)=>{
                  this.counterRandNumber = this.randomIntFromInterval(this.counterRandNumber,this.counterRandNumber + 1)
                  this.counter  = this.counter + this.counterRandNumber
                  this.checkCounter()
                  console.log(this.progress)
                  this.sub = interval(100).subscribe((val) => {
                    this.redirectPage(id)
                  });

                },(err)=>{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file, please try again.' });
                  this.uploadFlag = false
                })
              }else if(obj.message == "preview files created successfully."){
                this.previewStatus = true
              }
          },(err)=>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file, please try again.' });
            this.uploadFlag = false
          })
        },
        (err)=>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file, please try again.' });
            this.uploadFlag = false
        })
      },(err)=>{
        if(err.status == 409){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File already exists.' });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' });
        }
        this.uploadFlag = false
      })
    }
  }

  redirectPage(id: any){
    if(this.previewStatus){
      this.progress = `100%`;
      setTimeout(() => {
        this.uploadFlag = false;
        this.loadingmsg = '';
        let objId = encodeURI(btoa(JSON.stringify(id)).toString())
        this.router.navigate(['/content/new',objId]);
      }, 50);
      this.sub.unsubscribe()
    }
  }

  checkCounter(){
    this.subTimer = interval(400).subscribe((val) => {
      this.percentCount < this.counter ? this.processCount() : this.clearIntervalTimer()
    })
  }
  
  processCount(){
      this.progress = `${this.percentCount}%`;
      this.percentCount = this.percentCount + 1
  }

  clearIntervalTimer(){
    this.subTimer.unsubscribe()
  }

  randomIntFromInterval(min: any, max: any) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  uploadToBlobStorage(content: Blob, name: string){
    return new Promise((resolve) => {
      const blockBlobClient = this.blobService.containerClient().getBlockBlobClient(`${environment.folderName}/${name}`);
      blockBlobClient.uploadData(content, {
        blockSize: 4 * 1024 * 1024, // 4MB block size
        concurrency: 20, // 20 concurrency
        onProgress: (ev) => {
          let percent = Math.round(ev.loadedBytes/content.size*100)
          this.progress = `${percent}%`;
        }
        ,blobHTTPHeaders: { blobContentType: content.type } })
        .then((data: any) => {
          resolve({ state: true })
        }).catch((err) => {
          resolve({ state: false })
        })
    })
  }

}
