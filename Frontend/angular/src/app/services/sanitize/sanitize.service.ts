import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SanitizeService {

  constructor(private sanitizer: DomSanitizer) { }

  sanitizeObject(obj: any): boolean {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        const value = obj[prop];
        if (typeof value === 'string') {
          const sanitizedValue: SafeHtml = (value != null) ?  this.sanitizer.bypassSecurityTrustHtml(value) : '';
          if (value !== sanitizedValue) {
            return true; 
          }
        } 
      }
    }
    return false;
  }

  filterInputValue(value: string) {
    const sanitizedValue = value.replace(/[<>"'!]/g, ''); 
    return sanitizedValue;
  }
  
}
