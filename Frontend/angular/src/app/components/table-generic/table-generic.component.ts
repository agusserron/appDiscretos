import { AfterViewInit, Component, ContentChild, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';
import { AddStationComponent } from '../programs/add-station/add-station.component';

@Component({
  selector: 'app-table-generic',
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.css']
})
export class TableGenericComponent implements AfterViewInit {

  @Input() dataSource!: MatTableDataSource<any>;
  @Input() displayedColumns: string[] = [];
  @Input() customCellLogic!: (element: any, column: any) => any;
  @Input() pageSize: number = 10;
  @ViewChild(MatTableExporterDirective) exporter!: MatTableExporterDirective;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() dialogComponents:any;
  @Input() columnHeaders: { [key: string]: string } = {};
  @Output() dialogClosed = new EventEmitter<any>();
 
 


  exportedDataSource: any[] = [];
  alertService: any;
 
  
  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.setupPaginator();
    }
  }

  setupPaginator(): void {
    setTimeout(() => {
      this.paginator.pageSize = this.pageSize;
      this.paginator._intl.itemsPerPageLabel = "Items por página";
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && !changes['dataSource'].firstChange) {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.setupPaginator();
      }
    }
  }

  esFilaDesactivada(row: any): boolean {
    return row.userStatus !== undefined && row.userStatus !== 'Activo';
  }

  editAction(element: any): void {
    const dialogRef = this.dialog.open(this.dialogComponents[1], {
      data: element,
      height: '600px',
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.dialogClosed.emit(result);
    });
  }

  deleteAction (element:any) : void {
    const dialogRef = this.dialog.open(this.dialogComponents[0], {
      data: element,
      height: '430px',
      width: '430px',
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.dialogClosed.emit(result);
    });
  }

  verEstaciones(element: any): void {
    const dialogRef = this.dialog.open(AddStationComponent, {
      height: '800px',
      width: '1000px',
      data: { element } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
     
      }
    });
  }


  userDelete(element:any) {
    const dialogRef = this.dialog.open(this.dialogComponents[2], {
      data: element,
      height: '430px',
      width: '430px',
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.dialogClosed.emit(result);
    });
  
  }


  /*exportTable(type: string, name: string) {
    if (type === 'xls') {
      this.exporter.exportTable('xlsx', {
        fileName: name,
        sheet: 'Sheet1',
      });
    } else if (type === 'csv') {
      this.exporter.exportTable('csv', {
        fileName: name,
        sheet: 'Sheet1',
      });
    }
  }*/


  //////////////// NO LO USO
  exportTable(type: string, name: string) {
    if (type === 'xls' || type === 'xlsx' || type === 'csv' || type === 'txt' || type === 'json' || type === 'other') {

  
      // Realizar la exportación
      this.exporter.exportTable(type, {
        fileName: name,
        sheet: 'Sheet1',
      });

    } else {
      console.error('Tipo de exportación no válido');
    }
  }


  esFilaValida(row: any): boolean {
    return row.userStatus !== undefined && row.userStatus === 'Activo';
  }







}
