import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosAguaService {

  constructor(private http: HttpClient) { }

  getParametrosAgua(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/parametros/parametros-agua`);
  }




}
