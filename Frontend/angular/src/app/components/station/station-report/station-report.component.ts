import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Station } from 'src/app/models/station/aire.module';
import { SanitizeService } from 'src/app/services/sanitize/sanitize.service';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-station-report',
  templateUrl: './station-report.component.html',
  styleUrls: ['./station-report.component.css']
})
export class StationReportComponent implements OnInit {

  filteredOptions!: Observable<any[]>;
  nameStations: any = [];
  @ViewChild('picker') picker!: MatDatepicker<any>;
  stationSelected!: Station;
  tipos!: string[];
  parametros! : string [];
  parametrosStation : any = [];
  periodosStation : any = [];

  constructor(public alertService: AlertService,
    private _formBuilder: FormBuilder,
    private sanitizerService: SanitizeService,
    private stationService: StationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.disableInputs();
    this.getStations();
    this.filteredOptions = this.stationForm.controls['identificacion'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

  openPicker(): void {
    this.picker.open();
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  stationForm = this._formBuilder.group({
    identificacion: ['', Validators.required],
    fecha: ['', Validators.required],
    parametros: [],
    departamento: [''],
    propietario: [''],
    operador: [''],
    parametro: ['', Validators.required],
    tipoPeriodo: [[], Validators.required],
    valor: ['', Validators.required]
  });

  private getStations(): void {
    this.stationService.getStation().subscribe({
      next: (resp) => {
        this.nameStations = resp;
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
        if (err.status == 0) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  onOptionSelected(optionSelected: any) {
    this.stationSelected = optionSelected;
    this.tipos = optionSelected.tipos.split(",");
    this.parametros = optionSelected.parametros.split(",");
    this.parametrosStation = optionSelected.datosParametros;
    this.periodosStation = optionSelected.datosTipos;
    this.stationForm.patchValue({
      parametros: optionSelected.parametros,
      departamento: optionSelected.departamento.nombre,
      propietario: optionSelected.propietario.nombre,
      operador: optionSelected.operador.nombre
    })
  }

  clearStationInfo(): void {
    this.tipos = [];
    this.parametros = [];
    this.stationForm.patchValue({
      identificacion: '',
      parametro: '',
      departamento: '',
      propietario: '',
      operador: '',
      tipoPeriodo: null
    })
  }

  clearAll(): void {
    this.stationForm.reset();
    this.clearStationInfo();
    this.stationForm.controls['identificacion'].setErrors(null);
    this.stationForm.controls['tipoPeriodo'].setErrors(null);
    this.stationForm.controls['valor'].setErrors(null);
    this.stationForm.controls['fecha'].setErrors(null);
    this.stationForm.controls['parametro'].setErrors(null);
  }
 
  private disableInputs(): void {
    this.stationForm.controls['parametros'].disable();
    this.stationForm.controls['departamento'].disable();
    this.stationForm.controls['propietario'].disable();
    this.stationForm.controls['operador'].disable();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.nameStations.filter((station: any) => station.identificacion.toLowerCase().includes(filterValue));
  }

  filterSanitize(value: string): string {
    return this.sanitizerService.filterInputValue(value);
  }

  onFinish(): void {
    this.alertService.clear();
    if (this.validateStationReport()) {
      this.addStationReport();
    }
  }

  private addStationReport(): void {
    let reportStation = {
      "tipoPeriodo": this.stationForm.value.tipoPeriodo,
      "fecha": this.stationForm.value.fecha,
      "concentracion": this.stationForm.value.valor,
      "parametro": this.stationForm.value.parametro,
      "station": this.stationSelected
    }
    this.alertService.clear();
    this.stationService.addStationReport(reportStation).subscribe({
      next: (resp) => {
        this.alertService.success(resp.message, this.options);
        this.clearAll();
      },
      error: (err) => {
        this.alertService.error(err.error.message, this.options);
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    })
  }

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.stationForm.controls[controlName as keyof typeof this.stationForm.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  private validateExistNameStation(): boolean {
    return this.nameStations.filter((e: any) => e.identificacion === this.stationForm.value.identificacion).length > 0;
  }

  private validateStationReport(): boolean {
    let form = this.stationForm.value;
    if (form.fecha == "" || !form.fecha) {
      return this.showError('fecha', "Debe ingresar una fecha");
    }
    else if (form.identificacion == "" || !form.identificacion) {
      return this.showError('nombre', "Debe ingresar un nombre de estación");
    }
    else if (!this.validateExistNameStation()) {
      this.stationForm.controls['identificacion'].setValue(null);
      this.alertService.error("La estación no existe seleccione una existente", this.options);
      return false;
    }
    else if (form.parametro == "" || !form.parametro) {
      return this.showError('parametro', "Debe ingresar un parametro");
    }
    else if (Array.isArray(form.tipoPeriodo) && (form.tipoPeriodo as any[]).length === 0) {
      return this.showError('tipoPeriodo', "Debe ingresar un periodo");
    }
    else if (form.valor == "" || !form.valor) {
      return this.showError('valor', "Debe ingresar un valor");
    }
    else if (Number(form.valor) <= 0) {
      return this.showError('valor', "Debe ingresar un valor mayor a 0");
    }
    return true;
  }


}
