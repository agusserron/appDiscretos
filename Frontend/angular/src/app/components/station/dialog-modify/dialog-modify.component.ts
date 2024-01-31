import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {estados} from 'src/app/models/common.module';
import { Station } from 'src/app/models/station/aire.module';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-dialog-modify',
  templateUrl: './dialog-modify.component.html',
  styleUrls: ['./dialog-modify.component.css']
})
export class DialogModifyComponent {

  departamentos : any;
  parametros : any;
  propietarios : any;
  operadores : any;
  estados = estados;
  listPeriods : any;
  coordenadasPattern = /^-\d{2}\.\d+$/;
  parametrosStation : any = [];
  periodosStation : any = [];
  latitud : any;
  longitud : any;

  constructor(
    public dialogRef: MatDialogRef<DialogModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private stationService: StationService,
    public alertService: AlertService
  ) {
    this.setValuesStation(data);
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

  setValuesStation(dataStation: any): void {
    this.stationFormGroup.controls['codigo'].disable();
    this.stationFormGroup.controls['latitud'].disable();
    this.stationFormGroup.controls['longitud'].disable();
    dataStation.datosTipos.forEach((element:any) => {
      this.periodosStation.push(element.id);
    });
    dataStation.datosParametros.forEach((element:any) => {
      this.parametrosStation.push(element.id);
    });
    this.latitud = dataStation.latitud;
    this.longitud = dataStation.longitud;
    this.stationFormGroup.patchValue({
      identificacion: dataStation.identificacion,
      codigo: dataStation.codigo,
      latitud: dataStation.latitud,
      longitud: dataStation.longitud,
      propietario: dataStation.propietario.id,
      parametro: this.parametrosStation,
      departamento: dataStation.departamento.id,
      opera: dataStation.operador.id,
      estado: dataStation.estado == 0 ? 'Inactiva' : 'Activa',
      periodos: this.periodosStation
    })
  }

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
    else if (Array.isArray(form.parametro) && (form.parametro as any[]).length === 0) {
      return this.showError("parametro", "Debe ingresar por lo menos un parametro");
    }
    else if (!form.departamento) {
      return this.showError("departamento", "Debe ingresar un departamento");
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  modifyStation(): void {
    const form = this.stationFormGroup.value;
    let updateStation = new Station(
      this.data.codigo,
      form.identificacion!,
      this.latitud,
      this.longitud,
      form.parametro!,
      Number(form.departamento!),
      Number(form.propietario!),
      Number(form.opera!),
      form.estado == 'Activa' ? true : false,
      form.periodos!
    )
    if (this.validateStation()) {
      this.stationService.updateStation(updateStation).subscribe({
        next: (res) => {
          this.alertService.success(res.message);
          setTimeout(() => {
            this.dialogRef.close({ state: true });
          }, 1000)

        },
        error: (err) => {
          this.alertService.error(err.error.message);
        }
      })
    }
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
}
