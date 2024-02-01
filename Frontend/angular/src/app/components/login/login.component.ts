import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user/user.module';
import { LoginService } from 'src/app/services/login/login.service';
import { AlertService } from '../../components/alert';
import { LoginDTO } from 'src/app/models/login/loginDTO.module';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CookieService } from 'ngx-cookie-service';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  protected aFormGroup!: FormGroup

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(private loginService: LoginService, public alertService: AlertService, private router: Router, private formBuilder: FormBuilder, private cookieService: CookieService) {
    this.cleanCache();
    this.userTokenValid.subscribe((message) => {
      this.cleanCache();
      this.router.navigate(['login'])
    }
    )
  }

  user!: User
  loginDTO!: LoginDTO
  userTokenValid: Subject<any> = new Subject()
  timeoutId?: any
  siteKey: string = "6LfxktgiAAAAAPyCWbXaQB9Wu7rT4oJqwiU-Qkw7"
  @ViewChild('captchaElem') captchaElem!: ReCaptcha2Component;


  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
     // recaptcha: ['', Validators.required]
    });
  }

  cleanCache(): void {
    this.cookieService.delete('MAID');
    this.loginService.clearUserData();
  }

  validate(): boolean {
    let form = this.aFormGroup.value;
    if (form.username == "") {
      this.alertService.error("Debe ingresar un nombre de usuario", this.options);
      return false;
    }
    else if (form.password == "") {
      this.alertService.error("Debe ingresar una contraseña", this.options);
      return false;
    }
   // else if (form.recaptcha == "") {
     // this.alertService.error("Debe seleccionar el captcha", this.options);
     // return false;
    //}
    return true;
  }

  checkTimeTokenValid() {
    const hours = 4 //OJO AL CAMBIAR ESTO, ESTA CONFIGURADO EN EL BACKEND TAMBIÉN
    const timeValidToken = hours * 60 * 60 * 1000
    this.timeoutId = setTimeout(
      () => this.userTokenValid.next("Token valid for 4hs"), timeValidToken
    );
  }

  onLogin(): void {
    this.alertService.clear();
    let form = this.aFormGroup.value;
    this.user = new User(
      form.username,
      form.password,
    );
    if (this.validate()) {
      this.loginService.login(form.username, form.password).subscribe({
        next: (res) => {
          this.loginDTO = res;
          const expiresToken = new Date();
          expiresToken.setHours(expiresToken.getHours() + 3);
          const cookieOptions = { expires: expiresToken, secure: false };
          this.cookieService.set('MAID', this.loginDTO.token, cookieOptions);
          this.checkTimeTokenValid();
          form.password = "";
          form.username = "";
         // this.aFormGroup.value.recaptcha = '';
          this.getDataUser();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 0) this.alertService.error("Servicio sin conexión", this.options);
          else if (err.status == 400) this.alertService.error("Usuario o contraseña incorrecta", this.options);
          else {
            this.alertService.error(err.error, this.options);
          }
          form.password = "";
          form.username = "";
          //localStorage.removeItem('_grecaptcha');
          //this.captchaElem.resetCaptcha();
          //this.aFormGroup.value.recaptcha = '';
        }
      });
    }
  }

  getDataUser(): void {
    this.loginService.getDataUser().subscribe({
      next: (res) => {
        this.alertService.success("Ingreso exitoso", this.options);
        this.router.navigate(['SRD']);
      },
      error: (err) => {
        if (err.status == 401) {
          this.alertService.error("No es posible acceder a este sistema");
          this.aFormGroup.patchValue({
            username: '',
            password: ''
          })
          //localStorage.removeItem('_grecaptcha');
          //this.captchaElem.resetCaptcha();
          //this.aFormGroup.value.recaptcha = '';
        }
        else this.alertService.error("Error al realizar login");
      }
    })
  }


}
