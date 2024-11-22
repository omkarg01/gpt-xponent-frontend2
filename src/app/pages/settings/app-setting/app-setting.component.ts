import { Component } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AppSettingComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  settingsForm: UntypedFormGroup | any;
  dictionaryForm: UntypedFormGroup | any;
  showFileds: any = false
  constructor(
    private apiService: ApiService,      
    private messageService: MessageService,
  ){
      this.apiService.breadcumList.next([{label:{ label: 'App Settings' },index:0}])
    }
  ngOnInit(): void {
    this.settingsForm = new UntypedFormGroup({
      _id: new UntypedFormControl(null, [Validators.required]),
      suggestions: new UntypedFormControl([], [Validators.required]),
      breakouts: new UntypedFormArray([this.createNewBreakoutsGrp()]),
      ner: new UntypedFormArray([this.createNewNERGrp()]),
    })
    this.dictionaryForm = new UntypedFormGroup({
      ppt_dictionary: new UntypedFormArray([this.createNewGrp()]),
    })
    this.getSettings()
  }


  private createNewGrp(): UntypedFormGroup {
    return new UntypedFormGroup({
      word: new UntypedFormControl('', []),
      label: new UntypedFormControl([], []),
    });
  }

  public addNewGrp(control: any) {
    const rowsArray = this.dictionaryForm.get(control) as UntypedFormArray
    rowsArray.push(this.createNewGrp())
  }

  public removeOrClearGrp(control: any, i: number) {
    const rowsArray = this.dictionaryForm.get(control) as UntypedFormArray
    if (rowsArray.length > 1) {
      rowsArray.removeAt(i)
    } else {
      rowsArray.clear()
    }
  }

  private createNewBreakoutsGrp(): UntypedFormGroup {
    return new UntypedFormGroup({
      category: new UntypedFormControl('', []),
      tags: new UntypedFormControl([], []),
    });
  }

  public addNewBreakoutsGrp(control: any) {
    const rowsArray = this.settingsForm.get(control) as UntypedFormArray
    rowsArray.push(this.createNewBreakoutsGrp())
  } 

  public removeOrClearBreakoutsGrp(control: any, i: number) {
    const rowsArray = this.settingsForm.get(control) as UntypedFormArray
    if (rowsArray.length > 1) {
      rowsArray.removeAt(i)
    } else {
      rowsArray.clear()
    }
  }


  private createNewNERGrp(): UntypedFormGroup {
    return new UntypedFormGroup({
      category: new UntypedFormControl('', []),
      entities: new UntypedFormControl([], []),
    });
  }

  public addNewNERGrp(control: any) {
    const rowsArray = this.settingsForm.get(control) as UntypedFormArray
    rowsArray.push(this.createNewNERGrp())
  }

  public removeOrClearNERGrp(control: any, i: number) {
    const rowsArray = this.settingsForm.get(control) as UntypedFormArray
    if (rowsArray.length > 1) {
      rowsArray.removeAt(i)
    } else {
      rowsArray.clear()
    }
  }

  getSettings(){
    this.apiService.getSettings().subscribe((d: any)=>{
      this.settingsForm.get('_id').setValue(d._id)
      this.settingsForm?.get('suggestions').setValue(d?.suggestions)
      const breakouts = this.settingsForm.get('breakouts') as UntypedFormArray
      if(d.breakouts.length > 0){
        breakouts.clear()
        d.breakouts.forEach((element: any, index: any) => {
          this.addNewBreakoutsGrp('breakouts')
          breakouts.at(index).get('category')?.setValue(element.category)
          breakouts.at(index).get('tags')?.setValue(element.tags)
        });
      }
      const ner = this.settingsForm.get('ner') as UntypedFormArray
      if(d.ner.length > 0){
        ner.clear()
        d.ner.forEach((element: any, index: any) => {
          this.addNewNERGrp('ner')
          ner.at(index).get('category')?.setValue(element.category)
          ner.at(index).get('entities')?.setValue(element.entities)
        });
      }
      this.showFileds = true
    },(err)=>{
      this.showFileds = true
    })
  }

  saveSettings(){
    this.isLoading$.next(true)
    this.apiService.saveSettings(this.settingsForm.value).subscribe((d: any)=>{
      this.isLoading$.next(false)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: d.message });
    },(err)=>{
      this.isLoading$.next(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update settings, try again after sometime.' });
    })
  }
}
