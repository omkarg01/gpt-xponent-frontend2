import { Component } from '@angular/core';
import { ApiService } from '../../../common/services/api.service';
import { FormControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-connector-sp',
  templateUrl: './connector-sp.component.html',
  styleUrls: ['./connector-sp.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ConnectorSpComponent {
  adAppdtlForm: UntypedFormGroup | any;
  pipelineForm: UntypedFormGroup | any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isPipelineLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  frequency: any = [{ name: 'Hourly', code: 'Hourly' },{ name: 'Daily', code: 'Daily' },{ name: 'Weekly', code: 'Weekly' }]
  days: any[] = [
    { name: 'Monday', code: 'Monday' },
    { name: 'Tuesday', code: 'Tuesday' },
    { name: 'Wednesday', code: 'Wednesday' },
    { name: 'Thursday', code: 'Thursday' },
    { name: 'Friday', code: 'Friday' },
    { name: 'Saturday', code: 'Saturday' },
    { name: 'Sunday', code: 'Sunday' },
  ]
  activeTab: number = 0;
  siteData: any[] = [];
  pipelineData: any[] = [];
  folderData!: any[]
  siteKeyword!: any[]
  folderKeyword!: any[]
  fullpageLoader= true;
  constructor(private apiService: ApiService,private messageService: MessageService){
    this.apiService.breadcumList.next([{label:{ label: 'SharePoint Connector Settings' },index:2}])
  }

  ngOnInit(): void {
    this.adAppdtlForm = new UntypedFormGroup({
      clientID: new UntypedFormControl(null, [Validators.required]),
      tenantID: new UntypedFormControl(null, [Validators.required]),
      clientSecret: new UntypedFormControl(null, [Validators.required]),
    })
    this.pipelineForm = new UntypedFormGroup({
      pipelineData: new UntypedFormArray([this.createNewPipeLine()]),
    })
    this.getConnections()
  }

  p = ()=>{
    return this.pipelineForm.get('pipelineData') as UntypedFormArray
  }

  sitesKeyword(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    if(event.query != ''){
    for (let i = 0; i < this.siteData.length; i++) {
      if(Object.keys(this.siteData[i]).length !== 0){
        if (this.siteData[i]?.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(this.siteData[i]);
        }
      }
      }
    }else{
      filtered = this.siteData
    }
    this.siteKeyword = filtered;
  }

  foldersKeyword(event: any, index: any) {
    let filtered: any[] = [];
    let query = event.query;
    const rowsArray: any = this.p()
    if (event.query != '') {
      filtered = rowsArray?.at(index).get('folderData').value.filter((item: any)=>{
        if(Object.keys(item).length !== 0){
          return item.name.toLowerCase().includes(query.toLowerCase())
        }
      })
    } else {
      filtered = rowsArray?.at(index).get('folderData').value
    }
    this.folderKeyword = filtered;
  }

  onSiteSelectSearch(e: any,index: any){
    const rowsArray: any = this.p()
    rowsArray.at(index).get('siteid').setValue(e.id)
    rowsArray.at(index).get('sitename').setValue(e.name)
    rowsArray.at(index).get('folderData').setValue(e.folders)
  }

  onFolderSelectSearch(e: any,index: any){
    const rowsArray: any = this.p()
    rowsArray.at(index).get('folderid').setValue(e.id)
    rowsArray.at(index).get('foldername').setValue(e.name)
  }

  private createNewPipeLine(): UntypedFormGroup {
    return new UntypedFormGroup({
      _id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      databricksjobid: new UntypedFormControl(null, []),
      site: new UntypedFormControl(null, [Validators.required]),
      siteid: new UntypedFormControl(null, [Validators.required]),
      sitename: new UntypedFormControl(null, [Validators.required]),
      folderData: new UntypedFormControl(null, []),
      folder: new UntypedFormControl(null, [Validators.required]),
      folderid: new UntypedFormControl(null, [Validators.required]),
      foldername: new UntypedFormControl(null, [Validators.required]),
      frequency: new UntypedFormControl('', [Validators.required]),
      frequencyType: new UntypedFormControl(null, []),
      day: new UntypedFormControl(null, []),
      time: new UntypedFormControl(null, []),
      logs: new UntypedFormControl(null, []),
      updated: new UntypedFormControl(false, []),
    });
  }

  public addNewPipeline() {
    const rowsArray = this.p()
    rowsArray.push(this.createNewPipeLine());
    rowsArray.at(rowsArray.length - 1)?.get('name')?.setValue('Pipeline ' + rowsArray.length);  
  }

  public deletePipeline(i: number, id: any) {
    const rowsArray = this.p()
    if (rowsArray.length > 1) {
      rowsArray.removeAt(i)
    } else {
      rowsArray.clear()
      this.addNewPipeline()
    }
    if (id == null || id == '') {
    } else {
      this.apiService.deletePipelines({_id:id}).subscribe( //delete
        (resp: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success',life: 7000, detail: 'Pipeline Deleted' });
        },
        (err: any) => {
          console.log(err)
        }
      );
    }
  }

  getConnections(){
    this.apiService.getConnections().subscribe( //get
      (resp: any) => {
        this.fullpageLoader = false;
        this.siteData = resp.siteData
        this.pipelineData = resp.pipelineData
        const connectionData = JSON.parse(atob(resp.connectionData as any)).client_information
        this.adAppdtlForm.get('clientID').setValue(connectionData.clientID)
        this.adAppdtlForm.get('tenantID').setValue(connectionData.tenantID)
        this.adAppdtlForm.get('clientSecret').setValue(connectionData.clientSecret)
        resp.setingFlag == true ? this.activeTab = 1 : this.activeTab = 0;
        if(this.activeTab == 1 && this.pipelineData.length > 0){
          this.setItems()
        }else{
          this.pipelineForm.get('pipelineData').at(0).get('name').setValue('Pipeline 1')
        }
      },
      (err: any) => {
        this.fullpageLoader = false;
        console.log(err)
      }
    ); 
  }

  setItems(){    
    const rowsArray = this.p()
    rowsArray.clear();
    if(this.pipelineData.length > 0){
      this.pipelineData.forEach((element: any, index: number) => {
        this.addNewPipeline()
        rowsArray.at(index).get('_id')?.setValue(element._id)
        rowsArray.at(index).get('name')?.setValue(element.name)
        rowsArray.at(index).get('name')?.removeValidators(Validators.required);
        rowsArray.at(index).get('name')?.updateValueAndValidity(); 
        rowsArray.at(index).get('name')?.disable();
        rowsArray.at(index).get('databricksjobid')?.setValue(element.databricksjobid)
        rowsArray.at(index).get('site')?.setValue(this.siteData.find((e: any) => {return e.id == element.siteid}))
        rowsArray.at(index).get('site')?.removeValidators(Validators.required);
        rowsArray.at(index).get('site')?.updateValueAndValidity(); 
        rowsArray.at(index).get('site')?.disable();
        rowsArray.at(index).get('siteid')?.setValue(element.siteid)
        rowsArray.at(index).get('siteid')?.removeValidators(Validators.required);
        rowsArray.at(index).get('siteid')?.updateValueAndValidity(); 
        rowsArray.at(index).get('sitename')?.setValue(element.sitename)
        rowsArray.at(index).get('sitename')?.removeValidators(Validators.required);
        rowsArray.at(index).get('sitename')?.updateValueAndValidity(); 
        this.pipelineForm.get('pipelineData').at(index).get('folderData').setValue(rowsArray.at(index).get('site')?.value.folders)
        if(rowsArray.at(index).get('site')?.value.folders.find((e: any) => {return e.id == element.folderid}) != 'undefined'){
          rowsArray.at(index).get('folder')?.setValue(rowsArray.at(index).get('site')?.value.folders.find((e: any) => {return e.id == element.folderid}))
          rowsArray.at(index).get('folder')?.removeValidators(Validators.required);
          rowsArray.at(index).get('folder')?.updateValueAndValidity(); 
          rowsArray.at(index).get('folder')?.disable();
        }
        
        rowsArray.at(index).get('folderid')?.setValue(element.folderid)
        rowsArray.at(index).get('folderid')?.removeValidators(Validators.required);
        rowsArray.at(index).get('folderid')?.updateValueAndValidity(); 
        rowsArray.at(index).get('foldername')?.setValue(element.foldername)
        rowsArray.at(index).get('foldername')?.removeValidators(Validators.required);
        rowsArray.at(index).get('foldername')?.updateValueAndValidity(); 
        rowsArray.at(index).get('frequency')?.setValue(element.frequency)
        rowsArray.at(index).get('frequencyType')?.setValue(element.frequencyType)
        rowsArray.at(index).get('day')?.setValue(element.day)
        rowsArray.at(index).get('time')?.setValue(element.time)
        let logData  = element.logs
        logData.date = this.apiService.convertUTCDateToLocalDate(logData.date)
        rowsArray.at(index).get('logs')?.setValue(logData)
        rowsArray.at(index).markAllAsTouched()
      })
      
    }
  }

  setFlags(index: any){
    const rowsArray = this.p()
    rowsArray.at(index).get('updated')?.setValue(true)
    if(rowsArray.at(index).get('frequency')?.value == 'Daily'){
      rowsArray.at(index).get('time')?.addValidators(Validators.required);
      rowsArray.at(index).get('time')?.updateValueAndValidity();
    }else if(rowsArray.at(index).get('frequency')?.value == 'Weekly'){
      rowsArray.at(index).get('day')?.addValidators(Validators.required);
      rowsArray.at(index).get('time')?.addValidators(Validators.required);
      rowsArray.at(index).get('day')?.updateValueAndValidity();
      rowsArray.at(index).get('time')?.updateValueAndValidity();
    }else{
      rowsArray.at(index).get('day')?.removeValidators(Validators.required);
      rowsArray.at(index).get('time')?.removeValidators(Validators.required);
      rowsArray.at(index).get('day')?.updateValueAndValidity();
      rowsArray.at(index).get('time')?.updateValueAndValidity();
    }
  }

  saveConnections(){
    this.isLoading$.next(true);
    this.apiService.saveConnections({"connectorToken": btoa(JSON.stringify(this.adAppdtlForm.value))}).subscribe( //save
      (resp: any) => {
        this.isLoading$.next(false);
        if(resp.setingFlag && resp.connectionFlag){
        this.activeTab = 1
        this.siteData = resp.siteData
        this.messageService.add({ severity: 'success', summary: 'Success',life: 5000, detail: 'Connections is successful.' });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Invalid Credentials.' });
        }
      },
      (err: any) => {
        this.isLoading$.next(false);
        console.log(err)
      }
    ); 
  }

  disableandenable(flag: any){
    let rowsArray = this.p() as UntypedFormArray;
    rowsArray.controls.forEach((element: any, index: number) => {
      if(flag == true){
        rowsArray.at(index).get('site')?.enable();
        rowsArray.at(index).get('folder')?.enable();
        rowsArray.at(index).get('folderData')?.enable();
        rowsArray.at(index).get('folderData')?.enable();
        rowsArray.at(index).get('logs')?.enable();
      }else{
        rowsArray.at(index).get('site')?.disable();
        rowsArray.at(index).get('folder')?.disable();
        rowsArray.at(index).get('folderData')?.disable();
        rowsArray.at(index).get('folderData')?.disable();
        rowsArray.at(index).get('logs')?.disable()
      }
    });
  }

  savePipeline(){
    this.disableandenable(false)
    this.isPipelineLoading$.next(true);
    this.apiService.savePipelines(this.pipelineForm.value).subscribe( //save
      (resp: any) => {
        this.getConnections()
        this.disableandenable(true)
        this.isPipelineLoading$.next(false);
        this.messageService.add({ severity: 'success', summary: 'Success',life: 7000, detail: 'Pipeline setup completed, processing of pipelines might take few more minutes' });
      },
      (err: any) => {
        this.disableandenable(true)
        this.isPipelineLoading$.next(false);
        this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Something went wrong, please try again after sometime .' });
        console.log(err)
      });
  }

}
