import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../alert';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Program } from 'src/app/models/program/program.module';
import { AddProgramsComponent } from './add-programs/add-programs.component';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent {

  constructor(private _formBuilder: FormBuilder, 
    private alertService: AlertService, 
    private programService: ProgramService, 
    public dialog: MatDialog
    ) { }

    AddProgramsComponent: any = AddProgramsComponent;
    dataSource!: MatTableDataSource<Program>;
    displayedColumns: string[] = ['nombre_programa', 'codigo_programa', 'visible_externos', 'version', 'Acciones'];
    showTable: boolean = false;

    columnTitles: { [key: string]: string } = {
      nombre_programa: 'Nombre del Programa',
      codigo_programa: 'Código del Programa',
      visible_externos: 'Visible a Externos',
      version: 'Versión'
    };
  
    ngOnInit(): void {
      this.uploadPrograms();
    }

    uploadPrograms(): void {
      this.programService.getPrograms().subscribe({
        next: (resp) => {
          this.dataSource = new MatTableDataSource(resp);
          this.showTable = true;
        },
        error: (err) => {
          this.alertService.error("Error obteniendo los programas ")
        }
      })
    }


    addProgram(): void {
    const dialogRef = this.dialog.open(AddProgramsComponent, {
      height: '800px',
      width: '900px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadPrograms();
      }
    });
  }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      
      this.dataSource.filterPredicate = (data: Program, filter: string) => {
        const dataStr = Object.values(data).join(' ').toLowerCase();
        const words = dataStr.split(' '); // parto los strings en pedazos
    
        return !filter || words.some(word => word.startsWith(filter)); // miro si alguna palabra empieza con el filtro
      };
    
      this.dataSource.filter = filterValue;
    }

    
  customCellLogicFunction(element: any, column: any): any {
      if (column === "visible_externos") {
        return element.visible_externos === 1 ? 'Sí' : 'No';
      }
      return element[column];
  }


}
