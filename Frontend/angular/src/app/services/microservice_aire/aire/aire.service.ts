import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aire } from 'src/app/models/aire/aire.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AireService {

  constructor(private http: HttpClient) { }

  addAire(aire: Aire): Observable<any> {
    return this.http.post(`${environment.apiAire}/aire`, aire );
  }

  getAireReport(nroEnlace: string): Observable<Aire[]> {
    let parm = new HttpParams()
    .set('nroEnlace', nroEnlace);
    return this.http.get<Aire[]>(`${environment.apiAire}/aire/report`,{params: parm });
  }

  getAireReportByCity(departamento: string): Observable<any> {
    let parm = new HttpParams()
    .set('city', departamento)
    return this.http.get<any>(`${environment.apiAire}/aire/report/filter/city`,{ params: parm  });
  }

  getParameters(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/aire/parameters`);
  }

  getUnits(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/aire/units`);
  }

  getNombresPuntos(empresaId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/aire/nombresPuntos/${empresaId}`);
  }
 
  getLatLongPunto(nombrePunto: string): Observable<any> {
    const nombrePuntoEncoded = encodeURIComponent(nombrePunto);
    const params = new HttpParams().set('nombrePunto', nombrePuntoEncoded);
    return this.http.get<any>(`${environment.apiAire}/aire/latLong`, { params })
  }

  

}
