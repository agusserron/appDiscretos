import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Station } from 'src/app/models/station/aire.module';
import { SanitizeService } from 'src/app/services/sanitize/sanitize.service';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';
import { PdfCreatorComponent } from '../../pdf-creator/pdf-creator.component';
import { TableGenericComponent } from '../../table-generic/table-generic.component';

@Component({
  selector: 'app-station-consultant',
  templateUrl: './station-consultant.component.html',
  styleUrls: ['./station-consultant.component.css']
})
export class StationConsultantComponent implements OnInit {

  filteredOptions!: Observable<any[]>;
  nameStations: any = [];
  reportStations: any = [];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['fecha', 'concentracion', 'parametro', 'tipo', 'origen'];
  @ViewChild(TableGenericComponent) tableGenericComponent!: TableGenericComponent;
  @ViewChild('pdfGenerator', { static: false }) pdfGenerator!: PdfCreatorComponent;
  @ViewChild('picker') picker!: MatDatepicker<any>;
  stationSelected!: Station;
  tituloVariable = '';
  showTable: boolean = false;
  inicioFecha: any;
  finFecha: any;

  constructor(public alertService: AlertService,
    private _formBuilder: FormBuilder,
    private sanitizerService: SanitizeService,
    private stationService: StationService,
    private router: Router) { }

  stationForm = this._formBuilder.group({
    identificacion: ['', Validators.required],
    parametro: [''],
    departamento: [''],
    propietario: ['']
  });

  ngOnInit(): void {
    this.disableInputs();
    this.getStations();
    this.filteredOptions = this.stationForm.controls['identificacion'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  disableInputs(): void {
    this.stationForm.controls['parametro'].disable();
    this.stationForm.controls['departamento'].disable();
    this.stationForm.controls['propietario'].disable();
  }

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
    this.stationForm.patchValue({
      parametro: optionSelected.parametros,
      departamento: optionSelected.departamento.nombre,
      propietario: optionSelected.propietario.nombre
    })
   
  if (optionSelected.identificacion) {
    this.tituloVariable = optionSelected.identificacion.toUpperCase();
  } else {
    this.tituloVariable = 'Nombre de la Empresa';
  }
  }

  clearStationInfo(): void {
    this.stationForm.patchValue({
      identificacion: '',
      parametro: '',
      departamento: '',
      propietario: ''
    })
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.nameStations.filter((station: any) => station.identificacion.toLowerCase().includes(filterValue));
  }

  filterSanitize(value: string): string {
    return this.sanitizerService.filterInputValue(value);
  }

  exportPDF(): void {
    let title = 'Reporte estación - ' + this.stationForm.value.identificacion;
    const columnData = ['fecha', 'concentracion', 'parametro', 'tipo', 'origen'];
    this.pdfGenerator.exportPDF(columnData, title, 'Reporte estación');
  }



  onFinish(): void {
    this.alertService.clear();
    this.showTable = false;
    if (this.validateStationReport()) {
      this.stationService.getStationReports(this.stationSelected.codigo).subscribe({
        next: (resp: any) => {
          this.dataSource = new MatTableDataSource(resp.report)
          this.reportStations = resp;
          this.showTable = true;
          if (resp.report.length == 0) this.alertService.info("No existen reportes para esta estación", this.options);
        },
        error: (err: any) => {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
          if (err.status == 0) {
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1400);
          }
        }
      })
    }
  }

  private validateExistNameStation(): boolean {
    return this.nameStations.filter((e: any) => e.identificacion === this.stationForm.value.identificacion).length > 0;
  }

  validateStationReport(): boolean {
    if (this.stationForm.value.identificacion == "" || !this.stationForm.value.identificacion) {
      this.stationForm.controls['identificacion'].markAsTouched();
      this.alertService.error("Debe ingresar un nombre de estación", this.options);
      return false;
    }
    else if (!this.validateExistNameStation()) {
      this.stationForm.controls['identificacion'].setValue(null);
      this.alertService.error("La estación no existe seleccione una existente", this.options);
      return false;
    }
    return true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterDate() {
    if (this.finFecha && this.inicioFecha) {
      const startDate = new Date(this.inicioFecha);
      const endDate = new Date(this.finFecha);
      this.dataSource.data = this.dataSource.data.filter((e: any) => {
        const fecha = moment(e.fecha, 'DD/MM/YYYY').toDate();
        return fecha >= startDate && fecha <= endDate;
      });
    }
  }

  resetDate(): void {
    this.picker.open();
    if(this.finFecha && this.inicioFecha){
      this.finFecha=''
      this.inicioFecha = ''
      this.onFinish();
    }
  }

}
