import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
@Component({
  selector: 'app-addedit-modal',
  templateUrl: './addedit-modal.component.html',
  styleUrls: ['./addedit-modal.component.scss']
})
export class AddeditModalComponent {
  @Input() data: any = '';
  @Input() addEditFlag = false;
  addEditUserForm: UntypedFormGroup | any;
  roles: any = [{ name: 'Analyst', code: 'analyst' },{ name: 'Admin', code: 'admin' }]
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errMsg:string = '';
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.addEditUserForm = new UntypedFormGroup({
      username:new UntypedFormControl('', 
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(320)
      ]),
      email: new UntypedFormControl('', 
      [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)
      ]),
      role: new UntypedFormControl('analyst', [Validators.required]),
      loginType: new UntypedFormControl('manual', []),
    })
    if(this.addEditFlag){
      this.addEditUserForm.get('username').setValue(this.data.displayName)
      this.addEditUserForm.get('email').setValue(this.data.username)
      this.addEditUserForm.get('role').setValue(this.data.role)
    }
  }

  addUser(){
    this.isLoading$.next(true)
    if(this.addEditFlag){
      this.updateUser()
    }else{
      this.saveUser()
    }
  }

  saveUser(){
    let arr = [];arr.push(this.addEditUserForm.value)
    this.apiService.saveUsers(arr).subscribe((d: any)=>{
      this.isLoading$.next(false)
        if(d.status){
          this.activeModal.close({flag:d.status})
        }else{
          this.errMsg = "User already exists!!"
        }
    },err=>{
      this.isLoading$.next(false)
      this.activeModal.close({flag:false})
    })
  }
  updateUser(){
    this.apiService.updateUsers(this.addEditUserForm.value,this.data.username).subscribe((d: any)=>{
      this.isLoading$.next(false)
      this.activeModal.close({flag:true})
    },err=>{
      this.isLoading$.next(false)
      this.activeModal.close({flag:false})
    })
  }

}
