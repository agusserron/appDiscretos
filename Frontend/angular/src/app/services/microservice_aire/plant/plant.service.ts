import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlant, PlantToAdd } from 'src/app/models/plant/plant.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private http: HttpClient) { }

  getAllNroEnlaces(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/plant/nrosEnlace`);
  }

  getPlants(): Observable<IPlant[]> {
    return this.http.get<IPlant[]>(`${environment.apiAire}/plant`);
  }

  getPlant(nroEnlace: string): Observable<any> {
    let parm = new HttpParams()
      .set('nroEnlace', nroEnlace);
    return this.http.get<any>(`${environment.apiAire}/plant/nroEnlace`, { params: parm });
  }

  addPlant(plant: PlantToAdd): Observable<any> {
    return this.http.post(`${environment.apiAire}/plant/add`, plant);
  }

  getDepartaments(): Observable<any> {
    return this.http.get<any>(`${environment.apiAire}/plant/departaments`);
  }

}
