import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../components/alert';
import { AireService } from '../services/microservice_aire/aire/aire.service';


@Component({
  selector: 'app-dialog-modify-data',
  templateUrl: './dialog-modify-data.component.html',
  styleUrls: ['./dialog-modify-data.component.css']
})


export class DialogModifyDataComponent {


  parametros : any = [];
  periodos : any = [];


  constructor(
    public dialogRef: MatDialogRef<DialogModifyDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private stationService: StationService,
    public alertService: AlertService
  ) {
    this.setValuesStation(data);
    this.setAllItems();
  }

  stationFormGroup = this._formBuilder.group({
    concentracion: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    parametro: ['', []],
    periodo: ['', []]
  });
  
  
  setValuesStation(data: any): void {
    this.stationFormGroup.setValue({
      concentracion: data.concentracion,
      parametro: data.parametro,
      periodo: data.tipo
    });
  } 


  setParameters() {
    let idReporte = this.data.idReporte;
    this.stationService.getParametersByStation(idReporte).subscribe({
      next: (res) => {
        console.log(res);
        this.parametros = res.parametros;
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });
  }

  setAllItems(){
    this.setPeriods();
    this.setParameters();
  }


  setPeriods() {
    let idReporte = this.data.idReporte;
    this.stationService.getPeriodsByStation(idReporte).subscribe({
      next: (res) => {
        this.periodos = res.periodos;
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  modifyDataReport(): void {
    this.alertService.clear();
    const data = {
      idReporte: this.data.idReporte,
      concentracion: this.stationFormGroup.controls['concentracion'].value,
      parametro: this.stationFormGroup.controls['parametro'].value,
      periodo: this.stationFormGroup.controls['periodo'].value,
      idParametro : this.data.idParametro,
    };

    console.log(data);

    this.stationService.updateStationReport(data).subscribe({
      next: (res) => {
        this.alertService.success(res.message);
        setTimeout(()=> {
          this.dialogRef.close({state:true});
        },1000)
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });

    
  }

}