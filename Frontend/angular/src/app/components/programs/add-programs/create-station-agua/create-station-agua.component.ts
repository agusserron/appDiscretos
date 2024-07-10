import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { AlertService } from 'src/app/components/alert';
import { AguaService } from 'src/app/services/microservice_agua/agua/agua.service';
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
    private aguaService : AguaService,
    public dialogRef: MatDialogRef<CreateStationAguaComponent>,
  ) {
   
  }

  opciones: any[] = []; 
  tipoPunto: any[] = [];
  matrices: any[] = [];
  departamentos: any[] = [];
  subCuenca: any;

  programFormGroup = this._formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    punto: ['', Validators.required],
    matriz: ['', Validators.required],
    departamento: ['', Validators.required],
    orden: ['', Validators.required],
    ingresoInterno: [false],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    subcuenca: ['', Validators.required],
    cuenca: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getTipoPunto();
    this.getMatrices();
    this.getDepartamentos();
  }

  addStation() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTipoPunto() {
    this.stationAguaService.getTypePoint().subscribe({
      next: (res) => {
        this.tipoPunto = res;
      
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    })

  }

  getMatrices() {
    this.aguaService.getMatrices().subscribe({
      next: (res) => {
        this.matrices = res;
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    })

  }

  getDepartamentos() {
    this.aguaService.getDepartamentos().subscribe({
      next: (res) => {
        this.departamentos = res; 
        console.log(this.departamentos)    
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    })

  }

  setSubcuenca() {
    const latitud = this.programFormGroup.get('latitud')?.value;
    const longitud = this.programFormGroup.get('longitud')?.value;
  
    this.stationAguaService.getSubcuenca(latitud, longitud).pipe(
      switchMap((res) => {
        this.subCuenca = res;
        return this.stationAguaService.getCuencaById(this.subCuenca.sub_cue_cuenca_id);       
      })
    ).subscribe({
      next: (cuencaNombre) => {  
        this.programFormGroup.patchValue({
          subcuenca: this.subCuenca.sub_cue_nombre, 
          cuenca: cuencaNombre[0].cue_nombre
        });
      },
      error: (err) => {
        console.error('Error al obtener la información:', err);
      }
    });
  }


  obtenerOpciones() {}






}
