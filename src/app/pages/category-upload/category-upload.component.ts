import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/common/services/api.service';
import { BlobStorageService } from 'src/app/common/services/blob-storage.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-category-upload',
  templateUrl: './category-upload.component.html',
  styleUrls: ['./category-upload.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CategoryUploadComponent {
  uploadFlag = new BehaviorSubject<number>(0)
  loadingmsg: string = '';
  progress: any = '0%'
  percentCount: number = 0;
  subTimer: any;
  gFileName: string = 'example';
  summary: string = ``;
  processedData: any = [];
  cols: any =[] ;
  exportColumns: any;
  
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    private blobStorageService: BlobStorageService
  ){}
  
  ngOnInit(): void {
  }

  backtoUpload(){
    this.uploadFlag.next(0);
    this.progress = '0%';
    this.percentCount = 0;
    this.summary = '';
    this.processedData = [];
  }

  async onFileChange(event: any){
    if (event.target.files) {
      this.loadingmsg = 'Uploading file ....';
      this.uploadFlag.next(1);
      let file_name = event.target.files[0].name;
      let uploadFileName: any = this.apiService.attachTimestampToFileName(file_name)
      this.gFileName = uploadFileName.fileNameWithoutExt;
      const blobpath = `${environment.bloburl}/${environment.containerName}/${environment.chatContainerName}/${environment.categoryFolderName}/${uploadFileName.filename}`;
      this.progress = '0%';
      this.uploadToBlobStorage(event.target.files[0], uploadFileName.filename).then((d: any) => {
        this.loadingmsg = 'Analyzing...';
        this.progress = '0%';
        this.percentCount = 0;
        this.loaderCounter()
        this.apiService.categorizeDocumentDesc({upload_path:blobpath}).subscribe((obj: any)=>{
          this.uploadFlag.next(2);
          this.subTimer.unsubscribe()
          this.progress = `100%`;
          setTimeout(() => {
            this.cols = obj?.columns;
            this.summary = obj?.summary;
            this.processedData = obj?.table;
            this.exportColumns = this.cols.map((col: any) => ({
              title: col.header,
              dataKey: col.field,
            }));
          }, 100);
        },(err)=>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to process file, please try again.' });
          this.uploadFlag.next(0);
        })
      },
        (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file, please try again.' });
          this.uploadFlag.next(0);
        })
    }
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
      const blockBlobClient = this.blobStorageService.containerClient().getBlockBlobClient(`${environment.chatContainerName}/${environment.categoryFolderName}/${name}`);
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

  exportPdf() {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
            const doc = new jsPDF.default('p', 'px', 'a4');
            (doc as any).autoTable(this.exportColumns, this.processedData);
            let fileName = this.gFileName + '.pdf';
            doc.save(fileName);
        });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.processedData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer);
    });
  }
  saveAsExcelFile(buffer: any): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    let fileName = this.gFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    FileSaver.saveAs(data, fileName);
  }
}
