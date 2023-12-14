import { Component } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login/login.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-auth-interceptor',
  templateUrl: './auth-interceptor.component.html',
  styleUrls: ['./auth-interceptor.component.css']
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, 
    private router: Router,
    private loginService: LoginService,
    private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get('MAID')
    if (!token) {
      return next.handle(req);
    }
    const headers = req.clone({
      headers: req.headers.set('Authorization', token)
    });
    return next.handle(headers).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 0 || error.status == 504) {
          localStorage.removeItem('_grecaptcha');
          this.loginService.clearUserData();
          this.dialog.closeAll();
          this.router.navigate(['login']);
        } else if (error.status == 500) {
          this.router.navigate(['login']);
        }
        return throwError(error);

      })
    );
  }
}