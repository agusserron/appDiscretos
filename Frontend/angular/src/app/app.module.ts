import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AireComponent } from './components/industry/aire/aire.component';
import { LoginComponent } from './components/login/login.component';
import { AlertModule } from '../app/components/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import {RecaptchaModule,  RecaptchaFormsModule} from 'ng-recaptcha';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { MaterialModule } from './material.module';
import { CompanyComponent } from './components/company/view-company/view-company.component';
import { PlantComponent } from './components/plant/view-plant/view-plant.component';
import { DataComponent } from './components/industry/data/data.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthInterceptor } from './components/auth-interceptor/auth-interceptor.component';
import { CookieService } from 'ngx-cookie-service';
import { StationComponent } from './components/station/station-table/station.component';
import { DialogAgregarComponent } from './components/station/dialog-add/dialog-add.component';
import { StationReportComponent } from './components/station/station-report/station-report.component';
import { HomeStationComponent } from './components/station/home-station/home-station.component';
import { StationConsultantComponent } from './components/station/station-consultant/station-consultant.component';
import { TableGenericComponent } from './components/table-generic/table-generic.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PdfCreatorComponent } from './components/pdf-creator/pdf-creator.component';
import { DialogModifyComponent } from './components/station/dialog-modify/dialog-modify.component';
import { DialogDeleteComponent } from './components/station/dialog-delete/dialog-delete.component';
import { AddCompanyComponent } from './components/company/add-company/add-company.component';
import { AddPlantComponent } from './components/plant/add-plant/add-plant.component';
import { IndustryComponent } from './components/industry/home-industry/home-industry.component';
import { AddResultSampleComponent } from './components/collaborators/add-result-sample/add-result-sample.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    AireComponent,
    CompanyComponent,
    PlantComponent,
    DataComponent,
    StationComponent,
    DialogAgregarComponent,
    StationReportComponent,
    HomeStationComponent,
    AuthInterceptor,
    StationConsultantComponent,
    TableGenericComponent,
    PdfCreatorComponent,
    DialogModifyComponent,
    DialogDeleteComponent,
    AddCompanyComponent,
    AddPlantComponent,
    IndustryComponent,
    AddResultSampleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [CookieService,{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },AuthGuard, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},  { provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
  schemas:[
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
