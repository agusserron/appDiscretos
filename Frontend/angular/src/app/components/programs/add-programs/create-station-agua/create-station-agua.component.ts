import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AlertService } from 'src/app/components/alert';
import { StationAgua } from 'src/app/models/station-agua/sation-agua.module';
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
    private aguaService: AguaService,
    public dialogRef: MatDialogRef<CreateStationAguaComponent>,
  ) {

  }

  opciones: any[] = [];
  tipoPunto: any[] = [];
  matrices: any[] = [];
  idMatriz!: number;
  idProgrma!: number;
  idDepartamento!: number;
  idTipoPunto!: number;

  departamentos: any[] = [];
  subCuenca: any;
  existeEstacion: Boolean = false;
  estacion!: StationAgua;

  stationFormGroup = this._formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    punto: [null, Validators.required],
    matriz: [null, Validators.required],
    departamento: [null, Validators.required],
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

  validateStation(): boolean {
    this.alertService.clear();
    if (this.stationFormGroup.value.nombre == "" || !this.stationFormGroup.value.nombre) {
      return this.showError('nombre', "Debe ingresar un nombre");
    }
    else if (this.stationFormGroup.controls['nombre'].hasError('pattern')) {
      return this.showError('nombre', "Debe ingresar un nombre válido");
    }
    else if (this.stationFormGroup.value.codigo == "" || !this.stationFormGroup.value.codigo) {
      return this.showError('codigo', "Debe ingresar un código");
    }
    else if (!this.stationFormGroup.value.punto) {
      return this.showError('punto', "Debe seleccionar un punto");
    }
    else if (!this.stationFormGroup.value.matriz) {
      return this.showError('matriz', "Debe seleccionar una matriz");
    }
    else if (this.stationFormGroup.value.departamento) {
      return this.showError('departamento', "Debe seleccionar un departamento");
    }
    else if (this.stationFormGroup.value.orden == "" || !this.stationFormGroup.value.orden) {
      return this.showError('orden', "Debe ingresar un orden");
    }
    else if (this.stationFormGroup.value.latitud == "" || !this.stationFormGroup.value.latitud) {
      return this.showError('latitud', "Debe ingresar una latitud");
    }
    else if (this.stationFormGroup.value.longitud == "" || !this.stationFormGroup.value.longitud) {
      return this.showError('longitud', "Debe ingresar una longitud");
    }
    else if (this.stationFormGroup.value.subcuenca == "" || !this.stationFormGroup.value.subcuenca) {
      return this.showError('subcuenca', "Debe ingresar una subcuenca");
    }
    else if (this.stationFormGroup.value.cuenca == "" || !this.stationFormGroup.value.cuenca) {
      return this.showError('cuenca', "Debe ingresar una cuenca");
    }
    return true;
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


  async addStationAgua(): Promise<void> {
    const form = this.stationFormGroup.value;
    const newStation = new StationAgua(
      form.codigo!,
      form.nombre!,
      form.latitud!,
      form.longitud!,
      this.idProgrma,
      0,
      Number(form.punto!),
      Number(form.departamento!),
      this.subCuenca.sub_cue_cuenca_id,
      Number(form.orden!),
      Number(form.ingresoInterno!),
      Number(form.matriz!),
    );

    try {

      if (this.validateStation()) {
        this.stationAguaService.addStationAgua(newStation).subscribe({
          next: (res) => {
            this.alertService.success(res.message);
            setTimeout(() => {
              this.dialogRef.close({ state: true });
            }, 1000);
          },
          error: (err) => {
            this.alertService.error(err.error.message);
          }
        });
      }
    } catch (error) {
      console.error('Error en existStation:', error);
      this.alertService.error('Error al verificar la existencia de la estación.');
    }
  }


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
    const latitud = this.stationFormGroup.get('latitud')?.value;
    const longitud = this.stationFormGroup.get('longitud')?.value;

    this.stationAguaService.getSubcuenca(latitud, longitud).pipe(
      switchMap((res) => {
        this.subCuenca = res;
        return this.stationAguaService.getCuencaById(this.subCuenca.sub_cue_cuenca_id);
      })
    ).subscribe({
      next: (cuencaNombre) => {
        this.stationFormGroup.patchValue({
          subcuenca: this.subCuenca.sub_cue_nombre,
          cuenca: cuencaNombre[0].cue_nombre
        });
      },
      error: (err) => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
        }
        else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
      }
    });
  }


  obtenerOpciones() { }






}
