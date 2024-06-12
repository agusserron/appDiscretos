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
  deleteProgram(idPrograma: string): Observable<any> {
    let parm = new HttpParams()
      .set('id_programa', idPrograma);
    return this.http.delete(`${environment.apiAgua}/programas/data`, { params: parm });
  }


}

