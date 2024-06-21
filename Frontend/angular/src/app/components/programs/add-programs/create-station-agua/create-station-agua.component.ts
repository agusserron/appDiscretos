import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/components/alert';
import { StationAguaService } from 'src/app/services/microservice_agua/station-agua/station-agua.service';

@Component({
  selector: 'app-create-station-agua',
  templateUrl: './create-station-agua.component.html',
  styleUrls: ['./create-station-agua.component.css']
})
export class CreateStationAguaComponent {


  constructor(
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private stationAguaService: StationAguaService,
    public dialogRef: MatDialogRef<CreateStationAguaComponent>,
  ) {
   
  }

  opciones: any[] = []; // Arreglo para almacenar las opciones

  programFormGroup = this._formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    punto: ['', Validators.required],
    matriz: ['', Validators.required],
    departamento: ['', Validators.required],
    orden: ['', Validators.required],
    ingresoInterno: [false], // Valor inicial para checkbox, si es necesario
    latitud: ['', Validators.required],
    longitud: ['', Validators.required]
  });

  ngOnInit(): void {
   
  }

  addStation() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerOpciones() {}

  setSubcuenca() {}





}
