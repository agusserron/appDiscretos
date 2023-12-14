import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { departamentos, estados, operadores, parametrosEstaciones, periodsList, propietarios } from 'src/app/models/common.module';
import { Station } from 'src/app/models/station/aire.module';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';


@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.css']
})
export class DialogAgregarComponent {

  departamentos : any;
  propietarios : any;
  operadores : any;
  parametros : any;
  estados = estados;
  listPeriods : any;
  coordenadasPattern = /^-\d{2}\.\d+$/;

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarComponent>,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private stationService: StationService
  ) {
    this.setAllItems();
  }

  stationFormGroup = this._formBuilder.group({
    identificacion: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    codigo:  ['', [Validators.required]],
    parametro: [[], [Validators.minLength(1)]],
    latitud: ['', [Validators.required,Validators.pattern(this.coordenadasPattern)]],
    longitud: ['', [Validators.required, Validators.pattern(this.coordenadasPattern)]],
    propietario: ['', Validators.required],
    opera: ['', Validators.required],
    departamento: ['', Validators.required],
    estado: ['', Validators.required],
    periodos: [[], [Validators.minLength(1)]]
  });

  setAllItems(){
    this.setDepartaments();
    this.setInstitutes();
    this.setPeriods();
    this.setParmeters();
  }

  setDepartaments(){
    this.stationService.getDepartaments().subscribe({
      next:(res) => {
        this.departamentos = res;
      },
      error:(err) => {
        this.alertService.error(err.error.message);
      }
    })
  }

  setInstitutes(){
    this.stationService.getInstitutes().subscribe({
      next:(res) => {
        this.propietarios = res;
        this.operadores = res;
      },
      error:(err) => {
        this.alertService.error(err.error.message);
      }
    })
  }
  
  setPeriods(){
    this.stationService.getPeriods().subscribe({
      next:(res) => {
        this.listPeriods = res;
      },
      error:(err) => {
        this.alertService.error(err.error.message);
      }
    })
  }

  setParmeters() {
    this.stationService.getParameters().subscribe({
      next:(res) => {
        this.parametros = res;
      },
      error:(err) => {
        this.alertService.error(err.error.message);
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
    
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.stationFormGroup.controls[controlName as keyof typeof this.stationFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  validateStation(): boolean {
    this.alertService.clear();
    const form = this.stationFormGroup.value;
    if (!form.identificacion) {
      return this.showError("identificacion", "Debe ingresar un identificador");
    }
    else if (!form.codigo) {
      return this.showError("codigo", "Debe ingresar un código");
    }
    else if (Array.isArray(form.parametro) && (form.parametro as any[]).length === 0) {
      return this.showError("parametro", "Debe ingresar por lo menos un parametro");
    }
    else if (!form.departamento) {
      return this.showError("departamento", "Debe ingresar un departamento");
    }
    else if (!form.latitud) {
      return this.showError("latitud", "Debe ingresar una latitud");
    }
    else if (this.stationFormGroup.controls['latitud'].hasError('pattern')) {
      return this.showError("latitud", "Debe ingresar una latitud válida, debe ser -XX.XXXXX");
    }
    else if (!form.longitud) {
      return this.showError("longitud", "Debe ingresar una longitud");
    }
    else if (this.stationFormGroup.controls['longitud'].hasError('pattern')) {
      return this.showError("longitud", "Debe ingresar una longitud válida, debe ser -XX.XXXXX");
    }
    else if (!form.propietario) {
      return this.showError("propietario", "Debe ingresar un propietario");
    }
    else if (!form.opera) {
      return this.showError("opera", "Debe ingresar un operario de estación");
    }
    else if (!form.estado) {
      return this.showError("estado", "Debe ingresar un estado");
    }
    else if (Array.isArray(form.periodos) && (form.periodos as any[]).length === 0) {
      return this.showError("periodos", "Debe ingresar por lo menos un periodo");
    }
    return true;
  }

  addStation(): void {
    const form = this.stationFormGroup.value;
    let newStation = new Station(
      form.codigo!,
      form.identificacion!,
      form.latitud!,
      form.longitud!,
      form.parametro!,
      Number(form.departamento!),
      Number(form.propietario!),
      Number(form.opera!),
      form.estado == 'Activa' ? true : false,
      form.periodos!
    )
    if(this.validateStation()){
      this.stationService.addStation(newStation).subscribe({
        next:(res) => {
          this.alertService.success(res.message);
          setTimeout(() => {
            this.dialogRef.close({state:true});
          },1000)
        },
        error:(err) => {
          this.alertService.error(err.error.message);
        }
      })
    } 
  }

}
