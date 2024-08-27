import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient) { }

  getPrograms(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/programas`);
  }

  getParams(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/parametros`);
  }

  getProgramStation(programId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/programas/${programId}`);
  }

  //inactiva

  updateProgramStatus(idPrograma: string): Observable<any> {
    const body = { id_programa: idPrograma };
    return this.http.put(`${environment.apiAgua}/programas/data`, body);
  }

  existProgram(codigo: string, nombre: string): Observable<any> {
    let params = new HttpParams()
      .set('codigo', codigo)
      .set('nombre', nombre);
    return this.http.get<any>(`${environment.apiAgua}/programas/existePrograma`, { params });
  }

  addProgram(program: any): Observable<any> {
    return this.http.post<any>(`${environment.apiAgua}/programas/programa`, program);
  }


}

