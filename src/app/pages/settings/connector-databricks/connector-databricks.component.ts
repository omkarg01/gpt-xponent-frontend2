import { Component } from '@angular/core';
import { ApiService } from '../../../common/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-connector-databricks',
  templateUrl: './connector-databricks.component.html',
  styleUrls: ['./connector-databricks.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ConnectorDatabricksComponent {
  settingsForm: UntypedFormGroup | any;
  isTestConnection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isConnecting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  connectionData: any[] = []
  clusterData: any[] = [];
  catalogKeywords!: any[]
  schemaKeywords!: any[]
  tableKeywords!: any[]

  constructor(private apiService: ApiService, private messageService: MessageService) {
    this.apiService.breadcumList.next([{ label: { label: 'Databricks Connector Settings' }, index: 3 }])
  }

  ngOnInit(): void {
    this.settingsForm = new UntypedFormGroup({
      hostName: new UntypedFormControl(null, [Validators.required]),
      patToken: new UntypedFormControl(null, [Validators.required]),
      connectorToken: new UntypedFormControl(null, []),
      catalogName: new UntypedFormControl(null, [Validators.required]),
      schemaData: new UntypedFormControl([], []),
      schemaName: new UntypedFormControl(null, [Validators.required]),
      clusterName: new UntypedFormControl(null, [Validators.required]),
    })
    this.getConnection()
  }

  getConnection(){
    this.isLoading$.next(true)
    this.apiService.getDatabricksConnection().subscribe( //get Connection data
      (resp: any) => {
        this.isLoading$.next(false)
        if(resp.status){
          this.connectionData = resp.catalog_information;
          this.clusterData = resp.cluster_information;
          this.setItems(resp.connection_details)
        }
      },
      (err: any) => {
        this.isLoading$.next(false)
      }
    );
  }
  
  setItems(connectionDtl: any){
    const connectionData = JSON.parse(atob(connectionDtl))
    console.log(connectionData)
    this.settingsForm.get('hostName').setValue(connectionData.host)
    this.settingsForm.get('patToken').setValue(connectionData.token)
    this.settingsForm.get('catalogName').setValue(this.connectionData.find((e: any) => {return e.catalog_name == connectionData.catalog_name}))
    this.settingsForm.get('schemaData').setValue(this.settingsForm.get('catalogName')?.value.catalog_data)
    this.settingsForm.get('schemaName').setValue(this.settingsForm.get('schemaData').value.find((e: any) => {return e.schema_name == connectionData.schema_name}))
    this.settingsForm.get('clusterName').setValue(this.clusterData.find((e: any) => {return e.cluster_id == connectionData.cluster_name}))
  }

  testConnection() {
    this.isTestConnection$.next(true)
    this.apiService.testDatabricksConnection({"connectionDetails": btoa(JSON.stringify({"host":this.settingsForm.get('hostName').value,"token":this.settingsForm.get('patToken').value}))}).subscribe( //test
    (resp: any) => {
      this.isTestConnection$.next(false)
      if(resp.status){
        this.connectionData = resp.catalog_information;
        this.clusterData = resp.cluster_information;
        this.messageService.add({ severity: 'success', summary: 'Success',life: 5000, detail: 'Connections is successful.' });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Invalid Credentials.' });
      }
    },
    (err: any) => {
      this.isTestConnection$.next(false)
      this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Invalid Credentials.' });
    }
  );
  }

  saveConnection(){
    this.isConnecting$.next(true)
    this.apiService.saveDatabricksConnection({"connectionDetails": btoa(JSON.stringify({"host":this.settingsForm.get('hostName').value,"token":this.settingsForm.get('patToken').value})),"data":
    {"schema_name":this.settingsForm.get('schemaName').value?.schema_name,"catalog_name":this.settingsForm.get('catalogName').value?.catalog_name,"cluster_name":this.settingsForm.get('clusterName').value?.cluster_id}}).subscribe( //test
    (resp: any) => {
      this.isConnecting$.next(false)
      if(resp.status){
        this.messageService.add({ severity: 'success', summary: 'Success',life: 5000, detail: 'Connections saved successful.' });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Failed to save connection' });
      }
    },
    (err: any) => {
      this.isConnecting$.next(false)
      this.messageService.add({ severity: 'error', summary: 'Error',life: 5000, detail: 'Failed to save connection.' });
    }
  );
  }


  catalogKeyword(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    if (event.query != '') {
      for (let i = 0; i < this.connectionData.length; i++) {
        if (Object.keys(this.connectionData[i]).length !== 0) {
          if (this.connectionData[i]?.catalog_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(this.connectionData[i]);
          }
        }
      }
    } else {
      filtered = this.connectionData
    }
    this.settingsForm.get('schemaName').setValue(null)
    this.catalogKeywords = filtered;
  }

  onCatalogSelectSearch(e: any){
    this.settingsForm.get('schemaData').setValue(e.catalog_data)
  }
}
