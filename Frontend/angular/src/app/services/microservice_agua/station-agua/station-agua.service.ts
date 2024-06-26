import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationAguaService {

  constructor(private http: HttpClient) { }

  getStations(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/estaciones`);
  }

  getTypePoint(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/estaciones/tipoPunto`);
  }



}
