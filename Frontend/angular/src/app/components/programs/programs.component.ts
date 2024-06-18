import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../alert';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Program } from 'src/app/models/program/program.module';
import { AddProgramsComponent } from './add-programs/add-programs.component';
import { AddStationComponent } from './add-programs/add-station/add-station.component';
import { DialogDeletProgramComponent } from './dialog-delet-program/dialog-delet-program.component';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent {

  stations : any;
  idProgram : any;
  
  constructor(private _formBuilder: FormBuilder, 
    private alertService: AlertService, 
    private programService: ProgramService, 
    public dialog: MatDialog
    ) {
      
     }

    AddProgramsComponent: any = AddProgramsComponent;
    AddStationComponent : any = AddStationComponent;
    DialogDeletProgramComponent : any = DialogDeletProgramComponent;
    dataSource!: MatTableDataSource<Program>;
    
    displayedColumns: string[] = ['nombre_programa', 'codigo_programa', 'visible_externos', 'version', 'estado', 'estaciones', 'accion'];
   
   
    columnHeaders: { [key: string]: string } = {
      nombre_programa: 'Programa',
      codigo_programa: 'Código',
      visible_externos: 'Visible a Externos',
      version: 'Versión',
      estaciones: 'Estaciones',
      accion: 'Acciones',
      estado: 'Estado'
    };

    showTable: boolean = false;
    

    ngOnInit(): void {
      this.uploadPrograms();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['dataSource'] && !changes['dataSource'].isFirstChange()) {
        this.uploadPrograms();
        console.log('Se detectaron cambios en dataSource:', changes['dataSource']);
      }
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
      height: '1000px',
      width: '1000px',
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
        const words = dataStr.split(' '); 
    
        return !filter || words.some(word => word.startsWith(filter)); 
      };
    
      this.dataSource.filter = filterValue;
    }

    
  customCellLogicFunction(element: any, column: any): any {
      if (column === "visible_externos") {
        return element.visible_externos === 1 ? 'Sí' : 'No';
      }
      else if(column === "estado") {
        return element.estado === 1 ? 'Activo' : 'Inactivo';
      }

      return element[column];
  }

  manageEvent(data: any): void {
    if(data != undefined ){
      this.showTable = false;
      this.uploadPrograms()
    }

  }

  handleDialogClosed(result: any): void {
    if (result != undefined && result.state) {
      this.uploadPrograms();
    }
  }

 

}
