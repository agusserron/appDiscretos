import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station/aire.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getStation(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/station`);
  }

  addStation(station: Station): Observable<any> {
    return this.http.post(`${environment.apiAire}/station`, station);
  }

  updateStation(station: Station): Observable<any> {
    return this.http.put(`${environment.apiAire}/station`, station);
  }

  deleteStation(codigo: string): Observable<any> {
    let parm = new HttpParams()
      .set('codigo', codigo);
    return this.http.delete(`${environment.apiAire}/station`, { params: parm });
  }

  addStationReport(reportStation: any): Observable<any> {
    return this.http.post(`${environment.apiAire}/station/report`, reportStation);
  }

  getStationReports(codigo: string): Observable<any> {
    let parm = new HttpParams()
      .set('codigo', codigo);
    return this.http.get(`${environment.apiAire}/station/report`, { params: parm });
  }

  getDepartaments(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/plant/departaments`);
  }

  getInstitutes(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/station/institutes`);
  }

  getPeriods(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/station/periods`);
  }

  getParameters(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/station/parameters`);
  }
}
