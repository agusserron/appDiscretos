import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';
import { DialogAgregarComponent } from '../dialog-add/dialog-add.component';
import { DialogModifyComponent } from '../dialog-modify/dialog-modify.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';


@Component({
  selector: 'app-station-table',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['codigo', 'identificacion', 'latitud', 'longitud', 'parametros', 'propietario', 'operador', 'departamento', 'estado', 'accion'];
  dataColumns: string[] = ['codigo', 'identificacion', 'latitud', 'longitud', 'parametros', 'propietario', 'operador', 'departamento.nombre', 'estado', 'accion'];
  DialogDeleteComponent: any = DialogDeleteComponent;
  DialogModifyComponent: any = DialogModifyComponent;
  showTable: boolean = false;
  itemsPerPageText = 'Items per page:';

  constructor(public dialog: MatDialog, private stationService: StationService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.showTable = false;
    this.uploadStations();
  }

  uploadStations(): void {
    this.stationService.getStation().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.showTable = true;
      },
      error: (err) => {
        this.alertService.error("Error obteniendo las empresas", this.options)
      }
    })
  }

  customCellLogicFunction(element: any, column: any): any {
    if (column == "estado") {
      return element.estado == 0 ? 'Inactiva' : 'Activa';
    } else if(column == "departamento"){
      return element.departamento.nombre;
    }else if(column == "propietario"){
      return element.propietario.nombre;
    }
    else if(column == "operador"){
      return element.operador.nombre;
    }
    return element[column];
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

 /* 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
*/

/* primeros caracteres */
/* averiguar porque no busca en el original (o este) en otra cosa que no sea la columna de identificacion */
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const dataStr = Object.values(data).join(' ').toLowerCase();
    const words = dataStr.split(' '); // parto los strings en pedazos

    return !filter || words.some(word => word.startsWith(filter)); // miro si alguna palabra empieza con el filtro
  };

  this.dataSource.filter = filterValue;
}



  addStation(): void {
    const dialogRef = this.dialog.open(DialogAgregarComponent, {
      height: '600px',
      width: '900px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadStations();
      }
    });
  }

  manageEvent(data: any): void {
    if(data != undefined && data.state){
      this.showTable = false;
      this.uploadStations();
    }
  }
}
