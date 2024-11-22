import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators, AbstractControl } from '@angular/forms';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { AuthService } from '../../../../common/services/auth.service'
import { ApiService } from '../../../../common/services/api.service'
import { environment } from 'src/environments/environment' 
 
@Component({
  selector: 'app-ad-user-import-modal',
  templateUrl: './ad-user-import-modal.component.html',
  styleUrls: ['./ad-user-import-modal.component.scss']
})
export class AdUserImportModalComponent {
  userADForm: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() userList: any = [];
  loading: boolean = false;
  totalUserCount = 0;
  totalActiveUserCount = 0
  adLoadingMsg = '';
  adUserList: any = [];
  syncUser: any = [];
  nextActiveLink = '';
  serachStr:string  = '';
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authService: AuthService,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.initADForm();
    this.importADUsers()
  }

  initADForm(){
    this.userADForm = new UntypedFormGroup({
      group: new UntypedFormArray([])
    });
  }

  public addNewUserRow() {
    const rowsArray = this.userADForm.get('group') as UntypedFormArray
    rowsArray.push(this.createNewUserRow())
  }

  private createNewUserRow(): UntypedFormGroup {
    return new UntypedFormGroup({
      loginType: new UntypedFormControl('AD', []),
      username: new UntypedFormControl('', []), 
      email: new UntypedFormControl('', []),  
      accountEnabled: new UntypedFormControl('', []),
      selected: new UntypedFormControl('', []),
      userExistFlag: new UntypedFormControl(false, []),
    });
  }


  async importADUsers(){
    // this.queryad = '';
    const accessToken = await this.authService.getSlientAccessToken()
    if(accessToken){
      this.loading = true;
      this.apiService.getADUsersCount(accessToken).pipe(
        map((res: any) => this.totalUserCount = res),
        switchMap(async (value) => {
          this.adLoadingMsg = this.totalUserCount > 999 ? "This process will take few seconds more" : "";
          this.totalUserCount < 999 ? this.get999Users() : this.getUserswithNextLink();
        })
      ).subscribe(val => {});
    }else{

    }
  }

  generateUserForm(){
    this.syncUser = [];
    const userRow = this.userADForm.get('group') as UntypedFormArray
    let userData = this.adUserList.filter((d: any)=>  d.mail != null )
    userData.forEach((element: any, index: number) => {
      if(element.mail != null){
        this.addNewUserRow();
        userRow.at(index).get('accountEnabled')?.setValue(element.accountEnabled);
        userRow.at(index).get('username')?.setValue(element.displayName);
        userRow.at(index).get('email')?.setValue(element.mail);
        const userExists = this.userList.find((d: any)=> d.username == element.mail)
        if(typeof userExists != 'undefined'){
          userRow.at(index).get('selected')?.setValue(true);
          userRow.at(index).get('userExistFlag')?.setValue(true);
          this.syncUser.push(true);
        }else{
          userRow.at(index).get('selected')?.setValue(false);
        }
      }
    })
    this.totalActiveUserCount = userData.length
  }

  getUserToSync(item: any){
    if(typeof this.userList.find((d: any)=> d.username == item.email) == 'undefined'){
      return false;
    }else{
      return true
    }
}

getSelectedUser = () => {
  const userRow: UntypedFormArray = this.userADForm.get('group') as UntypedFormArray;
  const syncUser = userRow.value.filter((ctrl: any) => {
    if(!ctrl.userExistFlag && ctrl.selected) {
      return ctrl;
    }
  });
  return syncUser
}

saveADUsers(){
  let syncUser = this.getSelectedUser();
  if(syncUser.length > 0){
    this.isLoading$.next(true)
    this.apiService.saveUsers(syncUser).subscribe((d)=>{
      this.isLoading$.next(false)
      this.activeModal.close({flag:true})
    },err=>{
      this.isLoading$.next(false)
      this.activeModal.close({flag:false})
    })
  }
  
}

searchItem(e: any){
  this.serachStr = e.target.value;
}

setSelectedFlag(flag: boolean, email: any){
  let i: number = 0;
  const userRow: UntypedFormArray = this.userADForm.get('group') as UntypedFormArray;
  userRow.value.forEach((ctrl: any) => {
    if(ctrl.email == email) {
      userRow.at(i).get('selected')?.setValue(flag);
      return;
    }
    i++;
  });
}

selectUser(e: any, email: any){
  if(e.target.checked){
    this.setSelectedFlag(true,email);
  }else{
    this.setSelectedFlag(false,email);
  }
}

setSelectedUSerFlag(flag: boolean){
  let i: number = 0;
  const userRow: UntypedFormArray = this.userADForm.get('group') as UntypedFormArray;
  userRow.value.forEach((ctrl: any) => {
    if(!ctrl.userExistFlag) {
      userRow.at(i).get('selected')?.setValue(flag);
    }
    i++;
  });
}
selectAllUsers(e: any){
  if(e.target.checked){
    this.setSelectedUSerFlag(true)
  }else{
    this.setSelectedUSerFlag(false)
  }
}

  async get999Users(){
    let url = environment.graphAPIUrl+ 'users?$top=999';
    const accessToken = await this.authService.getSlientAccessToken()
    this.apiService.getADUsers(url,accessToken).subscribe((d: any)=>{
      this.adUserList = d.value;
      this.generateUserForm()
      this.loading = false;
    })
  }

  async getUserswithNextLink(){
    this.nextActiveLink = environment.graphAPIUrl+ 'users?$top=999';
    let nooftimeapicall = Math.ceil(this.totalUserCount/ 999) > 10 ? 10 : Math.ceil(this.totalUserCount/ 999);
    this.adUserList = [];
    for(let i = 1; i<= nooftimeapicall; i++) {
      const users = await this.loadNextUsers()
      if(i == nooftimeapicall && users){
        this.generateUserForm()
        this.loading = false;
      }
    }

  }

  async loadNextUsers() {
    return new Promise(async(resolve)=>{
      const accessToken = await this.authService.getSlientAccessToken()
      this.apiService.getADUsers(this.nextActiveLink,accessToken).subscribe((users: any)=> {
        this.nextActiveLink = users['@odata.nextLink'];
        this.adUserList = [...this.adUserList,...users.value]
        resolve(true)
      })
    })      
  }

  closeModal(){
    this.activeModal.dismiss('Cross click')
    this.modalService.dismissAll();
  }
}