import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-verify-user-by-email',
  templateUrl: './verify-user-by-email.component.html',
  styleUrls: ['./verify-user-by-email.component.scss']
})
export class VerifyUserByEmailComponent {
  token: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.verifyEmail()
    });
  }

  verifyEmail(){
    this.authService.verifyEmail({token:this.token}).subscribe(
      (d: any) =>{
        if(d.status){
          this.authService.verifiedUserData.next(d.data)
          this.router.navigate(['/auth/signup/workspace']);
        }else{
          this.isLoading$.next(false)
        }
      },
      (err)=>{
        this.isLoading$.next(false)
      });
  }
}
