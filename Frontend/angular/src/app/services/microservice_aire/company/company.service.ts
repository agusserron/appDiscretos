import { getLocaleId } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Company, CompanyToAdd } from 'src/app/models/company/company.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanys(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiAire}/company`);
  }

  getNroEnlaces(nameCompany: string): Observable<any> {
    let parm = new HttpParams()
      .set('nombreEmpresa', nameCompany);
    return this.http.get<any>(`${environment.apiAire}/company/nroEnlace`, { params: parm });
  }

  existRUTCompany(rut: number): Observable<any> {
    let parm = new HttpParams()
      .set('rutEmpresa', rut);
    return this.http.get<any>(`${environment.apiAire}/company/rut`, { params: parm }).pipe(
      map(
        resp => {
          return resp;
        })
    );

   
  }

  addCompany(company: CompanyToAdd): Observable<any> {
    return this.http.post(`${environment.apiAire}/company/add`, company);
  }

}
