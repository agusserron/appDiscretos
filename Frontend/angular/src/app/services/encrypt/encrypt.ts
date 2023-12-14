import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private encryptionKey = 'M324!!#weg95d@plsaw0&zqCm$'; 

  encryptData(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string): any {
    const decryptedDataBytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    const decryptedData = JSON.parse(decryptedDataBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}
