import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Company } from 'src/app/models/company/company.module';
import { AireService } from 'src/app/services/microservice_aire/aire/aire.service';
import { AlertService } from '../../alert';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Departamento, departamentos } from 'src/app/models/common.module';
import * as moment from 'moment';
import { PdfCreatorComponent } from '../../pdf-creator/pdf-creator.component';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { PlantService } from 'src/app/services/microservice_aire/plant/plant.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface Chip {
  search: string,
  column: string,
}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit, AfterViewInit {

  constructor(
    private _formBuilder: FormBuilder, 
    private aireService: AireService, 
    private companyService: CompanyService,
    private plantService: PlantService,
    public alertService: AlertService, 
    private router: Router) { }

  @ViewChild('pdfGenerator', { static: false }) pdfGenerator!: PdfCreatorComponent;
  displayedColumns: string[] = ['nombrePunto', 'latitud', 'longitud', 'fechaInicio', 'fechaFin', 'parametro', 'unidad', 'valor', 'metodologia', 'frecuencia', 'equipo', 'tipoMonitoreo', 'valorMaximo', 'observaciones', 'origen'];
  dataSource: any = new MatTableDataSource();
  filteredOptions!: Observable<Company[]>;
  filteredOptionsNroEnlace!: Observable<string[]>;
  nameCompanys: any = [];
  color: ThemePalette = 'primary';
  disabled = false;
  nroEnlaces: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showDepartamento: boolean = false;
  showEmpresa: boolean = true;
  departamentos: Departamento[] = departamentos;
  columnas: string[] = ['Parametro', 'Tipo', 'Fecha', 'Punto'];
  listChipFilter: Chip[] = [];
  selectedColumn: string = '';
  textFilter: string = '';
  inicioFecha: any;
  finFecha: any;
  showBuscar: boolean = true;
  showFilterDate: boolean = false;
  title: string = '';
  tituloVariable = '';
  nombresPuntos: any = [];

  dataFormGroup = this._formBuilder.group({
    nombreEmpresa: [''],
    nroEnlace: [''],
    nombrePlanta: [''],
    direccionPlanta: [''],
    departamentoPlanta: [''],
    departamentoFilter: [''],
    columnaFilter: ['']
  });

  filterFormGroup = this._formBuilder.group({
    inicioFecha: [''],
    finFecha: ['']
  });

  ngOnInit(): void {
    this.disableInputs();
    this.getCompanys();
    this.filteredOptions = this.dataFormGroup.controls['nombreEmpresa'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

  disableInputs(): void {
    this.dataFormGroup.controls['nombrePlanta'].disable();
    this.dataFormGroup.controls['direccionPlanta'].disable();
    this.dataFormGroup.controls['departamentoPlanta'].disable();
  }

  onSelectionChange(): void {
    if (this.selectedColumn == "Fecha") {
      this.showBuscar = false;
      this.showFilterDate = true; 
    } else if (this.selectedColumn == "Tipo") {
      this.showFilterDate = false;
      this.showBuscar = true;
    } else if (this.selectedColumn == "Punto") {
      this.showFilterDate = false;
      this.showBuscar = true;

    }
  }

  private getCompanys(): void {
    this.companyService.getCompanys().subscribe({
      next: (resp) => {
        this.nameCompanys = resp
      },
      error: err => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  private _filterNroEnlace(value: string): string[] {
    const filterValue = value;
    return this.nroEnlaces.filter((value: string) => value.startsWith(filterValue));
  }

  private getNroEnlaces(): void {
    let nombreEmpresa = this.dataFormGroup.value.nombreEmpresa || '';
    this.tituloVariable = this.dataFormGroup.value.nombreEmpresa || '';
    this.companyService.getNroEnlaces(nombreEmpresa).subscribe({
      next: (resp) => {
        this.nroEnlaces = resp.nroEnlaces;
        this.filteredOptionsNroEnlace = this.dataFormGroup.controls['nroEnlace'].valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filterNroEnlace(value || '')),
        )
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        } else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
      }
    });
  }

  addFilterColumnDate(): void {
    let fechaInicio = new Date(this.inicioFecha);
    let fechaFin = new Date(this.finFecha);
    var dateFormatStart = fechaInicio.getDate().toString().padStart(2, '0') + "/" + (fechaInicio.getMonth() + 1).toString().padStart(2, '0') + "/" + fechaInicio.getFullYear();
    var dateFormatEnd = fechaFin.getDate().toString().padStart(2, '0') + "/" + (fechaFin.getMonth() + 1).toString().padStart(2, '0') + "/" + fechaFin.getFullYear();
    const chip: Chip = {
      search: dateFormatStart + '-' + dateFormatEnd,
      column: this.selectedColumn,
    };
    this.listChipFilter.push(chip);
    var indice = this.columnas.indexOf(this.selectedColumn);
    if (indice > -1) {
      this.columnas.splice(indice, 1);
    }
    this.applyFilters();
    this.inicioFecha = '';
    this.finFecha = '';
    this.selectedColumn = '';
    this.showFilterDate = false;
    this.showBuscar = true;
  }

  //Agus 
  getNombresPuntos(): void {
    let idCompany: number = 0;
    for (let i = 0; i < this.nameCompanys.length; i++) {
      if (this.dataFormGroup.value.nombreEmpresa == this.nameCompanys[i].nombre) {
        idCompany = this.nameCompanys[i].id;
        console.log(idCompany);
      }
    }

    this.aireService.getNombresPuntos(idCompany).subscribe({
      next: (resp: any) => {
        this.nombresPuntos = resp.nombresPuntos;
    
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
        else if(err.status == 400) this.alertService.error(err.error.message, this.options);
        else this.alertService.error("Error obteniendo nombres de puntos", this.options);
      }
    })
  }

  addFilterColumnPunto(): void {
    this.alertService.clear();
    if (this.selectedColumn && this.selectedColumn == 'Punto') {
    if (this.textFilter) {
      const chip: Chip = {
        search: this.textFilter,
        column: this.selectedColumn,
      };
      this.listChipFilter.push(chip);
      var indice = this.columnas.indexOf(this.selectedColumn);
      if (indice > -1) {
        this.columnas.splice(indice, 1);
      }
      this.applyFilters();
      this.textFilter = '';
      this.selectedColumn = '';
    }
    else this.alertService.warn("Se debe ingresar texto en el buscador");
  }

  }

  addFilterColumn(): void {
    this.alertService.clear();
    if (this.selectedColumn && this.selectedColumn != 'Fecha') {
      if (this.textFilter) {
        const chip: Chip = {
          search: this.textFilter,
          column: this.selectedColumn,
        };
        this.listChipFilter.push(chip);
        var indice = this.columnas.indexOf(this.selectedColumn);
        if (indice > -1) {
          this.columnas.splice(indice, 1);
        }
        this.applyFilters();
        this.textFilter = '';
        this.selectedColumn = '';
      }
      else this.alertService.warn("Se debe ingresar texto en el buscador");
    }
    else if (this.selectedColumn && this.selectedColumn == 'Fecha') {
      this.addFilterColumnDate();
    }
    else this.alertService.warn("Se debe seleccionar una columna");
  }

  deleteChip(chip: Chip): void {
    this.columnas.push(chip.column);
    var indice = this.listChipFilter.indexOf(chip);
    if (indice > -1) {
      this.listChipFilter.splice(indice, 1);
    }
    this.applyFilters();
    this.selectedColumn = '';
  }

  filterDepartamento(): void {
    this.listChipFilter = [];
    this.columnas = ['Parametro', 'Tipo', 'Fecha', 'Planta'];
    this.dataFormGroup.reset();
    this.filterFormGroup.reset({ inicioFecha: '', finFecha: '' }, { emitEvent: false });
    this.showEmpresa = false;
    this.showDepartamento = true;
    this.dataSource.data = [];
    this.displayedColumns = ['fechaInicio', 'fechaFin', 'parametro', 'unidad', 'valor', 'metodologia', 'frecuencia', 'equipo', 'tipoMonitoreo', 'nombrePlanta', 'nroEnlace', 'observaciones', 'origen'];
  }

  filterEmpresa(): void {
    this.listChipFilter = [];
    this.columnas = ['Parametro', 'Tipo', 'Fecha', 'Punto'];
    this.listChipFilter = [];
    this.dataFormGroup.reset();
    this.displayedColumns = ['nombrePunto','latitud', 'longitud', 'fechaInicio', 'fechaFin', 'parametro', 'unidad', 'valor', 'metodologia', 'frecuencia', 'equipo', 'tipoMonitoreo', 'valorMaximo', 'observaciones', 'origen'];
    this.showDepartamento = false;
    this.showEmpresa = true;
    this.dataSource.data = [];
  }

  setNrosEnlaces(): void {
    this.getNroEnlaces();
    if (this.dataFormGroup.value.nombreEmpresa != '' || this.dataFormGroup.value.nroEnlace != '') this.dataSource.data = [];
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Items por página";
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      for (const filterObj of this.listChipFilter) {
        const filterColumn = filterObj.column.toLowerCase();
        const filterValue = filterObj.search.trim().toLowerCase();
        if (filterColumn === 'tipo') {
          if (!data.tipoMonitoreo.toLowerCase().includes(filterValue)) {
            return false;
          }
        } else if (filterColumn === 'parametro') {
          if (!data.parametro.toLowerCase().includes(filterValue)) {
            return false;
          }
        } else if (filterColumn === 'planta') {
          if (!data.nombre.toLowerCase().includes(filterValue)) {
            return false;
          }
        } else if (filterColumn === 'fecha') {
          const filterValueDate = filterValue.split('-');
          const fechaInicio = moment(filterValueDate[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
          const fechaFin = moment(filterValueDate[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
          const dataInicioConvertida = moment(data.fechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD');
          const dataFinConvertida = moment(data.fechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');
          if (!(dataInicioConvertida >= fechaInicio && dataFinConvertida <= fechaFin)) {
            return false;
          }
        } else if (filterColumn === 'punto') {
          if (!data.nombrePunto.toLowerCase().includes(filterValue)) {
            return false;
          }
        }
      }
      return true;
    };

    const filters = this.listChipFilter.map(chip => ({
      column: chip.column,
      search: chip.search.trim().toLowerCase()
    }));
    this.dataSource.filter = JSON.stringify(filters);
  }

  validateCompanyAndPlant(): boolean {
    if (this.dataFormGroup.value.nombreEmpresa == "" || !this.dataFormGroup.value.nombreEmpresa) {
      this.alertService.error("Debe ingresar un nombre de empresa", this.options);
      return false;
    }
    else if (this.dataFormGroup.value.nroEnlace == "" || !this.dataFormGroup.value.nroEnlace) {
      this.alertService.error("Debe ingresar una número de enlace", this.options);
      return false;
    }
    else if (!this.validateExistNameCompany()) {
      this.dataFormGroup.controls['nombreEmpresa'].setValue(null)
      this.dataFormGroup.controls['nroEnlace'].setValue(null)
      this.cleanPlantInformation()
      this.alertService.error("La empresa no existe seleccione una existente", this.options)
      return false;
    }
    else if (!this.validateExistNroEnlace()) {
      this.dataFormGroup.controls['nroEnlace'].setValue(null)
      this.cleanPlantInformation()
      this.alertService.error("Número de enlace no existe para esta empresa, se debe agregar planta", this.options)
      return false;
    }
    return true;
  }

  validateCity(): boolean {
    if (this.dataFormGroup.value.departamentoFilter == "" || !this.dataFormGroup.value.departamentoFilter) {
      this.alertService.error("Debe seleccionar un departamento", this.options);
      return false;
    }
    return true;
  }

  cleanPlantInformation(): void {
    this.dataFormGroup.controls['nombrePlanta'].setValue(null);
    this.dataFormGroup.controls['direccionPlanta'].setValue(null);
    this.dataFormGroup.controls['departamentoPlanta'].setValue(null);
  }

  validateExistNameCompany(): boolean {
    return this.nameCompanys.filter((e: any) => e.nombre === this.dataFormGroup.value.nombreEmpresa).length > 0;
  }

  validateExistNroEnlace(): boolean {
    return this.nroEnlaces.filter((e: any) => e === this.dataFormGroup.value.nroEnlace).length > 0;
  }

  getReportByCompany(): void {
    let nroEnlace = this.dataFormGroup.value.nroEnlace || '';
    this.aireService.getAireReport(nroEnlace).subscribe({
      next: (resp: any) => {
        this.dataSource.data = resp.aireReport;
        this.dataSource.paginator = this.paginator;
        if (resp.aireReport.length == 0) {
          this.alertService.warn("No existen reportes para esta planta");
        }
        this.filterFormGroup.reset();
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
        else if(err.status == 400) this.alertService.error(err.error.message, this.options);
        else this.alertService.error("Error buscando reportes", this.options);
      }
    })
  }

  getReportByCity(): void {
    let departamento = this.dataFormGroup.value.departamentoFilter;
    this.aireService.getAireReportByCity(departamento!).subscribe({
      next: (resp: any) => {
        this.dataSource.data = resp.aireReport;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
        else if(err.status == 400) this.alertService.error(err.error.message, this.options);
        else this.alertService.error("Error buscando reportes", this.options);
      }
    })
  }

  loadTable(): void {
    this.alertService.clear();
    if (this.showEmpresa && this.validateCompanyAndPlant()) {
      this.getReportByCompany();
    }
    else if (this.showDepartamento && this.validateCity()) {
      this.getReportByCity();
    }
  }

  exportPDF(): void {
    if (this.showEmpresa) this.title = 'Reporte calidad - ' + this.dataFormGroup.value.nombreEmpresa;
    else if (this.showDepartamento) this.title = 'Reporte calidad - Departamento: ' + this.dataFormGroup.value.departamentoFilter;
    const columnData = ['latitud', 'longitud', 'fechaInicio', 'fechaFin', 'parametro', 'unidad', 'valor', 'metodologia', 'frecuencia', 'equipo', 'tipoMonitoreo', 'valorMaximo', 'observaciones']
    this.pdfGenerator.exportPDF(this.dataSource.data, columnData, this.title, 'Reporte calidad');
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  validateCompany(): boolean {
    if (this.dataFormGroup.value.nombreEmpresa == "" || !this.dataFormGroup.value.nombreEmpresa) {
      this.alertService.error("Debe ingresar un nombre de empresa", this.options);
      return false;
    }
    else if (!this.validateExistNameCompany()) {
      this.dataFormGroup.controls['nombreEmpresa'].setValue(null);
      this.alertService.error("La empresa no existe seleccione una existente", this.options);
      return false;
    }
    return true;
  }

  showPlantInfo(): void {
    this.alertService.clear();
    if (this.validateCompany()) {
      let nroEnlace = this.dataFormGroup.value.nroEnlace || '';
      if (nroEnlace != '') {
        this.getPlant(nroEnlace);
      }
    } else {
      this.cleanPlantInformation();
    }
  }

  private getPlant(nroEnlace: string) {
    this.plantService.getPlant(nroEnlace).subscribe({
      next: (resp) => {
        let plant = resp.plant;
        this.setValueForm(plant.nombre, plant.direccion, plant.departamento);
      },
      error: err => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          this.router.navigate(['login']);
        }
        else if(err.status == 400) this.alertService.error(err.error.message, this.options);
        else this.alertService.error("Error obteniendo planta", this.options);
      }
    })
  }

  setValueForm(name: string, direccion: string, departamento: string): void {
    this.dataFormGroup.controls['nombrePlanta'].setValue(name);
    this.dataFormGroup.controls['direccionPlanta'].setValue(direccion);
    this.dataFormGroup.controls['departamentoPlanta'].setValue(departamento);
  }

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.nameCompanys.filter((company: any) => company.nombre.toLowerCase().includes(filterValue));
  }

}
