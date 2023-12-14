import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  callDataUser() {
    return new Promise((resolve, reject) => {
      this.loginService.getDataUser().subscribe({
        next: (res) => {
          /*if (res.role == 'ADMIN' || res.role == 'TECNICO') {
            resolve(true);
          }*/
          if (res.roles.includes('CIS-admin')) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }, error: (error) => {
          resolve(false);
        }
      });
    });
  }

  async isUserLogged() {
    return await this.callDataUser();
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    let userInfo = this.loginService.getUserData();
    let permissions = ['SRD-ADMIN', 'SRD-AIRE'];
    //let rolesUs = userInfo.roles.filter((role:any) => role !== 'SRD-ADMIN');
    if(userInfo == ''){
      this.router.navigate(['login'])
      return false;
    }
    else if(userInfo.roles.some((role:any) => permissions.includes(role))){
      return true;
    }
    else {
      this.router.navigate(['login'])
      return false;
    }
  }
}
