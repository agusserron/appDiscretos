
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { routes } from 'src/app/app-routing.module';
import { NavItem } from 'src/app/models/common.module';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  get user() {
    return this.loginService.dataUser
  }
  
  panelOpenState: boolean = false;
  sidenavWidth = 4;
  ngStyle!: string;
  routes = routes;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit(): void {
  }

  menu: NavItem[] = [
    {
      displayName: 'AIRE',
      iconName: '#aire',
      children: [
        {
          displayName: 'INDUSTRIA',
          iconName: '#data',
          route: '/SRD/industry',
          external: false,
          roles: []
        },
        {
          displayName: 'ESTACIONES',
          iconName: '#report',
          route: '/SRD/station',
          external: false,
          roles: []
        }
      ],
      roles: ['SRD-ADMIN', 'SRD-AIRE'],
      external: false
    },
    /*{
      displayName: 'AGUA',
      iconName: '#agua',
      route: '/login',
    },*/
    {
      displayName: 'EMPRESAS',
      iconName: '#company',
      route: '/SRD/company',
      external: false,
      roles: ['SRD-ADMIN', 'SRD-AIRE'],
    },
    {
      displayName: 'PLANTAS',
      iconName: '#plant',
      route: '/SRD/plant',
      external: false,
      roles: ['SRD-ADMIN', 'SRD-AIRE'],
    },
    {
      displayName: 'COLABORADORES',
      iconName: '#collaborators',
      children: [
        {
          displayName: 'INGRESO',
          iconName: '#data',
          route: '/SRD/collaborators',
          external: false,
          roles: []
        }
      ],
      roles: ['SRD-ADMIN'],
      external: false
    },
    {
      displayName: 'AGUA',
      iconName: '#agua',
      children: [
        {
          displayName: 'PROGRAMAS',
          iconName: '#data',
          route: '/SRD/programs',
          external: false,
          roles: []
        },
        {
          displayName: 'ESTACIONES',
          iconName: '#plant',
          route: '/SRD/station-agua',
          external: false,
          roles: []
        }
      ],
      roles: ['SRD-ADMIN'],
      external: false
    },
    {
      displayName: 'SHINY',
      iconName: '#graph',
      externalUrl: 'http://dinama-shiny:3838/sia_apps',
      external: true,
      roles: ['SRD-ADMIN']
    }
  ];

  navigateLink(item: any) {
    if (item.external) {
      const token = this.cookieService.get('MAID');
      const urlWithToken = `${item.externalUrl}/vSIA?token=${token}`;
      window.open(urlWithToken, '_blank');
    } else {
      this.router.navigate([item.route]);
    }
  }

  hasRequiredRoles(item: NavItem): boolean {
    if (item.roles) {
      return item.roles.some(role => this.user.roles.includes(role));
    }
    return true;
  }

  logout() {
    localStorage.removeItem('_grecaptcha');
    this.loginService.clearUserData();
  }

}
