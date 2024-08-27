import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstitucionAgua, InstitucionAguaEdit } from 'src/app/models/instituciones-agua/instituciones-agua.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitucionAguaService {

  constructor(private http: HttpClient) { }

  getInstituciones(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/instituciones`);
  }

  addInstitucion(institucion: InstitucionAgua): Observable<any> {
    return this.http.post(`${environment.apiAgua}/instituciones/addInstitucion`, institucion);
  }

  editInstitucion(institucion: InstitucionAguaEdit): Observable<any> {
    return this.http.post(`${environment.apiAgua}/instituciones/editInstitucion`, institucion);
  }

  delInstitucion(id_institucion: number): Observable<any> {
    const body = { id_institucion: id_institucion };
    return this.http.post<number>(`${environment.apiAgua}/instituciones/delInstitucion`, body);
  }

}
