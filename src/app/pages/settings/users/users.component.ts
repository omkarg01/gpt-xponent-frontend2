import { Component } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddeditModalComponent } from './addedit-modal/addedit-modal.component'
import { AdUserImportModalComponent } from './ad-user-import-modal/ad-user-import-modal.component'
import { ConfirmationService, MessageService } from 'primeng/api';
import { MsalService } from '@azure/msal-angular';

export interface UserData {
  _id:string;
  displayName: string;
  username: string;
  role: string;
  created_at: string
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class UsersComponent {
  serachStr:string  = ''
  loading: boolean = true;
  userData!: UserData[];
  adactiveUser: any;
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private authMsalService: MsalService,
    private messageService: MessageService){
    this.apiService.breadcumList.next([{label:{ label: 'User Settings' },index:1}])
  }

  ngOnInit(): void {
    this.getAllUsers()
    this.adactiveUser = this.authMsalService.instance.getActiveAccount() 
  }

  searchItem(e: any){
    this.serachStr = e.target.value;
  }

  getDateFormated(utcdate: any){
    return this.apiService.getDateFormated(utcdate)
  }

  getAllUsers(){
    this.loading = true;
    this.apiService.getAllUsers().subscribe((d: any)=>{
      this.userData = d.data;
      this.loading = false;
    },(err)=>{
      this.loading = false;
    })
  }

  openModal(){
    return this.modalService.open(AddeditModalComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true, scrollable: true });
  }

  add(){
    const modalRef = this.openModal()
    modalRef.result.then((data: any) => { // on close
      if(data.flag){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'We are delighted to share that we have successfully saved user profile, and invitation have been sent to them.' });
        this.getAllUsers()
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'We apologize for any inconvenience caused. Regrettably, we encountered an issue while saving user profile. Our team is diligently working to resolve this and ensure a seamless experience for you.' });
      }
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });
  }
  edit(row: any){
    const modalRef = this.openModal()
    modalRef.componentInstance.addEditFlag = true
    modalRef.componentInstance.data = row
    modalRef.result.then((data: any) => { // on close
      if(data.flag){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'We are delighted to share that we have successfully updated user profile, and invitation have been sent to them.' });
        this.getAllUsers()
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'We apologize for any inconvenience caused. Regrettably, we encountered an issue while updating user profile. Our team is diligently working to resolve this and ensure a seamless experience for you.' });
      }
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });
  }

  listADUsers(){
    const modalRef = this.modalService.open(AdUserImportModalComponent,{ backdrop: 'static', ariaLabelledBy: 'modal-basic-title', size: 'medium', centered: true, scrollable: true });
    modalRef.componentInstance.userList = this.userData
    modalRef.result.then((data) => {// on close
      if(data.flag){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'We are delighted to share that we have successfully saved all user profiles, and invitations have been sent to each of them.' })
        this.getAllUsers()
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'We apologize for any inconvenience caused. Regrettably, we encountered an issue while saving user profiles. Our team is diligently working to resolve this and ensure a seamless experience for you.' });
      }
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
  });
  }

  deleteUser(id: any){
    this.apiService.deleteUser(id).subscribe((d)=>{
      this.getAllUsers()
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully!' });
    },(err)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong! failed to delete user' });
    })
  }
}
