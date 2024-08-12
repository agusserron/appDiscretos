import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StationAgua } from 'src/app/models/station-agua/sation-agua.module';
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

    return this.http.get<any>(`${environment.apiAgua}/estaciones/subcuenca`, { params })
  }

  getCuencaById(idCuenca: number): Observable<any> {
    return this.http.get(`${environment.apiAgua}/estaciones/cuenca`, {
      params: { nroCuenca: idCuenca.toString() }
    });
  }

  existStation(station: any): Observable<any> {
    const params = new HttpParams()
    .set('codigo', station.codigo.toString())
    .set('nombre', station.nombre.toString());
    return this.http.get(`${environment.apiAgua}/estaciones/existeEstacion`, { params });
  }

  addStationAgua(agua: any): Observable<any> {
    return this.http.post(`${environment.apiAgua}/estaciones/estacionAgua`, agua );
  }



}
