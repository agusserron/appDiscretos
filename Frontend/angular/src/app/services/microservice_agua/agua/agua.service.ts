import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AguaService {

  constructor(private http: HttpClient) { }

  getMatrices(): Observable<any> {
    return this.http.get<any>(`${environment.apiAgua}/matrices`);
  }

}
