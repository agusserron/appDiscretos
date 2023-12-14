import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyToAdd } from 'src/app/models/company/company.module';
import { AireService } from 'src/app/services/microservice_aire/aire/aire.service';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent {

  constructor(
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private companyService: CompanyService,
    private aireService: AireService
  ) {}

  companyFormGroup = this._formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    rut: ['', Validators.required],
    direccion: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]]
  });

  exit(): void {
    this.dialogRef.close();
  }
    
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.companyFormGroup.controls[controlName as keyof typeof this.companyFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  validateCompany(existRUT: number): boolean {
    this.alertService.clear();
    if (this.companyFormGroup.value.nombre == "" || !this.companyFormGroup.value.nombre) {
      return this.showError('nombre', "Debe ingresar un nombre de empresa");
    }
    else if (this.companyFormGroup.controls['nombre'].hasError('pattern')) {
      return this.showError('nombre', "Debe ingresar un nombre de empresa válido");
    }
    else if (this.companyFormGroup.value.rut == "" || !this.companyFormGroup.value.rut) {
      return this.showError('rut', "Debe ingresar un número de RUT");
    }
    else if (this.companyFormGroup.value.direccion == "" || !this.companyFormGroup.value.direccion) {
      return this.showError('direccion', "Debe ingresar una dirección");
    }
    else if (this.companyFormGroup.controls['direccion'].hasError('pattern')) {
      return this.showError('direccion', "Debe ingresar una dirección válida");
    }
    else if (existRUT > 0) {
      this.companyFormGroup.controls['rut'].setValue(null);
      return this.showError('rut', "Ya existe ese número de RUT");
    }
    return true
  }

  validateAndAddCompany(): void {
    this.companyService.existRUTCompany(Number(this.companyFormGroup.value.rut?.valueOf())).subscribe(
      {
        next: (resp) => {
          if (this.validateCompany(resp.existRUT)) {
            let company = new CompanyToAdd(
              this.companyFormGroup.value.nombre!,
              this.companyFormGroup.value.rut!.toString(),
              this.companyFormGroup.value.direccion!,
            )
            this.addCompany(company);
          }
        },
        error: (err) => {
          if (err.status == 0) {
            this.alertService.clear();
            this.alertService.error("Servicio sin conexión", this.options);
            /*setTimeout(() => {
              this.router.navigate(['login']);
            }, 1400);*/
          }
          else if (err.status == 400) {
            this.alertService.error(err.error.message, this.options);
          }
        }
      }
    );
  }

  private addCompany(company: CompanyToAdd) {
    this.companyService.addCompany(company).subscribe({
      next: (resp) => {
        this.alertService.success(resp.message, this.options);
        setTimeout(() => {
          this.dialogRef.close({state:true});
        }, 1000)
      },
      error: err => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
          /*setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);*/
        } else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
      }
    })
  }

  
}
