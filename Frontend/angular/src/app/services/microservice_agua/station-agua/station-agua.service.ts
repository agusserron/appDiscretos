import { HttpClient, HttpParams } from '@angular/common/http';
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

  getSubcuenca(lat: any, long: any): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('long', long.toString());

    return this.http.get<any>(`${environment.apiAgua}/subcuenca`, { params })
  }


}
