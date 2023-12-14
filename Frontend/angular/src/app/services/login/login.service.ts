import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserData } from 'src/app/models/user/user.module';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from '../encrypt/encrypt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private encryptionService: EncryptionService) { }

  private userData: UserData = {
    nombre:'',
    roles: ['']
  }

  get dataUser() {
    return this.getUserData();
  }

  private localStorageKey = 'USMA';

  saveUserData(data: any): void {
    const encryptedData = this.encryptionService.encryptData(data);
    localStorage.setItem(this.localStorageKey, encryptedData);
  }

  getUserData(): any {
    const encryptedData = localStorage.getItem(this.localStorageKey);
    if(encryptedData == null) return '';
    const data = this.encryptionService.decryptData(encryptedData!);
    return data;
  }

  clearUserData(): void {
    localStorage.removeItem('_grecaptcha');
    localStorage.removeItem(this.localStorageKey);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiAuth}/login`, { username, password });
  }

  getDataUser(): Observable<any> {
    return this.http.get<UserData>(`${environment.apiAuth}/user`).pipe(
      tap((resp:any) => {
        this.saveUserData(resp);
        this.userData = resp;
      })
    )
  }

}
