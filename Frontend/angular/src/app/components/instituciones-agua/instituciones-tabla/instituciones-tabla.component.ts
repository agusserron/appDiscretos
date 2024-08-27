import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InstitucionAguaService } from 'src/app/services/microservice_agua/instituciones-agua/instituciones-agua.service';
import { AlertService } from '../../alert';
import { DialogAgregarInstAguaComponent } from '../dialog-add/dialog-add.component';
import { DialogEditarInstAguaComponent } from '../dialog-modify/dialog-modify.component';
import { DialogDeleteInstAguaComponent } from '../dialog-delete/dialog-delete.component';


@Component({
  selector: 'app-instituciones-tabla',
  templateUrl: './instituciones-tabla.component.html',
  styleUrls: ['./instituciones-tabla.component.css']
})


export class InstitucionesAguaComponent implements OnInit {

  columnHeaders: { [key: string]: string } = {
    nombre_institucion: 'Nombre',
    accion: 'Acciones',
    estado: 'Estado'
  };

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'estado', 'accion'];
  dataColumns: string[] = ['nombre', 'estado', 'accion'];
 
 
  DialogEditarInstAguaComponent: any = DialogEditarInstAguaComponent;
  DialogDeleteInstAguaComponent: any = DialogDeleteInstAguaComponent;


  showTable: boolean = false;
  itemsPerPageText = 'Items per page:';

  constructor(public dialog: MatDialog, private institucionAguaService: InstitucionAguaService, private alertService: AlertService) { }


  ngOnInit(): void {
    this.showTable = false;
    this.uploadInstituciones();
  }

  uploadInstituciones(): void {
    this.institucionAguaService.getInstituciones().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.showTable = true;
      },
      error: (err) => {
        this.alertService.error("Error obteniendo las Instituciones", this.options)
      }
    })
  }

  customCellLogicFunction(element: any, column: any): any {
    if (column == "estado") {
      return element.estado == 0 ? 'Inactiva' : 'Activa';
    }
    return element[column];
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };


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



  addInstitucion(): void {
    const dialogRef = this.dialog.open(DialogAgregarInstAguaComponent, {
      height: '600px',
      width: '900px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadInstituciones();
      }
    });
  }

  editInstitucion(): void {
    const dialogRef = this.dialog.open(DialogEditarInstAguaComponent, {
      height: '600px',
      width: '900px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadInstituciones();
      }
    });
  }


  manageEvent(data: any): void {
    if(data != undefined && data.state){
      this.showTable = false;
      this.uploadInstituciones();
    }
  }
}
