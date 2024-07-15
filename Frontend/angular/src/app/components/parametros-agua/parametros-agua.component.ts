import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ParametrosAgua } from 'src/app/models/parametros-agua/parametros-agua.module';
import { ParametrosAguaService } from 'src/app/services/microservice_agua/parametros-agua/parametros-agua.service';
import { AlertService } from '../alert';

@Component({
  selector: 'app-parametros-agua',
  templateUrl: './parametros-agua.component.html',
  styleUrls: ['./parametros-agua.component.css']
})
export class ParametrosAguaComponent {

  dataSource!: MatTableDataSource<ParametrosAgua>;
  showTable: boolean = false;
  displayedColumns: string[] = ['param_nombre', 'param_nomclave', 'param_enum', 'matriz_detalle'];
  columnFilters: { [key: string]: string } = {}; // Filtros para cada columna

  columnHeaders: { [key: string]: string } = {
    param_nombre: 'Nombre',
    param_nomclave: 'Nombre Clave',
    param_enum: 'Ennumerado',
    matriz_detalle: 'Matrices'
  };

  matrices: any = [];

  getColumnHeader(column: string): string {
    return this.columnHeaders[column] || column;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private alertService: AlertService,
    private parametrosAguaService: ParametrosAguaService,
  ) {}

  ngOnInit(): void {
    this.uploadParametros();
    this.getMatrices();
  }
/*
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
*/
  applyColumnFilter(column: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[column] = filterValue;
    this.dataSource.filter = JSON.stringify(this.columnFilters); // Actualizo el filtro para el caso de nombre o nombreclave
  }

  applyEnumFilter(value: string) {
    this.columnFilters['param_enum'] = value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.columnFilters); // Actualizo solo para enum
  }

  applyMatrizFilter(value: string) {
    this.columnFilters['matriz_detalle'] = value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.columnFilters); // Actualizo solo para matriz_detalle
  }


  uploadParametros(): void {
    this.parametrosAguaService.getParametrosAgua().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator; // Seteo el paginador cuando se cargan los datos
        this.paginator.pageSize = 10; // Esto no anda. por algun motivo queda siempre en 5. Cache?
        this.dataSource.filterPredicate = this.createFilter();
        this.showTable = true;
      },
      error: (err) => {
        this.alertService.error("Error obteniendo parametros ");
      }
    });
  }

  createFilter(): (data: ParametrosAgua, filter: string) => boolean {
    let filterFunction = (data: ParametrosAgua, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      return Object.keys(searchTerms).every(column => {
        const value = (data as any)[column]?.toString().toLowerCase() || '';
        return value.includes(searchTerms[column]);
      });
    };
    return filterFunction;
  }


  getMatrices(){
    this.parametrosAguaService.getMatrices().subscribe({
      next:(resp) => {
        this.matrices = resp;
      },
      error:(err) => {
      }
    })
  }


}





