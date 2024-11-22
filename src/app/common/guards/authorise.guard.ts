import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthoriseGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean  {
        const role: any = ['admin','Administrator'];
        if (!role.includes(this.authService.getRole())) {
          this.router.navigate(['/']);
          return false;
        }
        return true
  }
  
}
