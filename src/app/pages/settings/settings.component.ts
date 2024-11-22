import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApiService } from 'src/app/common/services/api.service';
import { MsalService } from '@azure/msal-angular';
import { HeaderService } from 'src/app/common/services/header.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  items!: MenuItem[];
  breadcrumbItems!: MenuItem[];
  toggleFlag = true;
  home!: MenuItem;
  adactiveUser: any;
  constructor (
    private apiService: ApiService,     
    private authMsalService: MsalService, 
    private router: Router,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.adactiveUser = this.authMsalService.instance.getActiveAccount() 
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.items = [
      {
        label: 'App Settings',
        icon: 'pi pi-fw pi-file',
        command: () => { this.router.navigate(['/settings/app']); },
        styleClass: 'menu-box',
        separator: true,
        visible: true
      },
      {
        label: 'User Settings',
        icon: 'pi pi-fw pi-user',
        styleClass: 'menu-box',
        separator: true,
        visible: true,
        command: () => { this.router.navigate(['/settings/users']); }
      },
      {
        label: 'SharePoint Connector Settings',
        icon: 'pi pi-spin pi-cog',
        styleClass: 'menu-box',
        separator: true,
        visible: this.adactiveUser != null ? true: false ,
        command: () => { this.router.navigate(['/settings/connector/sp']); },
      },
      {
        label: 'Databricks Connector Settings',
        icon: 'pi pi-spin pi-cog',
        styleClass: 'menu-box',
        separator: true,
        visible: true,
        command: () => { this.router.navigate(['/settings/connector/databricks']); }
      }
    ];

    this.apiService.breadcumList.subscribe((d) => {
      this.breadcrumbItems = [{ label: 'Manage Settings' }];
      if (d!= null) {
        this.breadcrumbItems.push(d[0].label) // add breadcomes
        setTimeout(() => {
          let menuitem = Array.from(document.getElementsByClassName("p-panelmenu-header-link"));
          for (let i = 0; i < menuitem.length; i++) {
            menuitem[i].classList.remove("menu-active");
          }
          menuitem[d[0].index].classList.add("menu-active"); // highlight menu
        }, 100);
      }
    })
    this.headerService.setIsMobileHeaderVisibleSubject(false)
  }

  activeMenu(event: any) {
    let node;
    if (event.target.tagName === "A") {
      node = event.target;
    } else {
      node = event.target.parentNode;
    }
    let menuitem = document.getElementsByClassName("p-panelmenu-header-link");
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove("menu-active");
    }
    node.classList.add("menu-active")
  }



  toggleMenu(){
    if(this.toggleFlag){
      this.toggleFlag = false
    }else{
      this.toggleFlag = true
    }
  }
}
