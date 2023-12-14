import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';

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
  @Output() dialogClosed = new EventEmitter<any>();
  
  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      if (this.paginator) {
        this.paginator.pageSize = this.pageSize;
        this.paginator._intl.itemsPerPageLabel = "Items por página";
      }
    });
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

  exportTable(type: string, name: string) {
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
  }


}
