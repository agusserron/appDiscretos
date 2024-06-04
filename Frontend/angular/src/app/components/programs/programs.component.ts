import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../alert';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Program } from 'src/app/models/program/program.module';
import { AddProgramsComponent } from './add-programs/add-programs.component';
import { AddStationComponent } from './add-programs/add-station/add-station.component';

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
    dataSource!: MatTableDataSource<Program>;

    displayedColumns: string[] = ['nombre_programa', 'codigo_programa', 'visible_externos', 'version', 'estaciones', 'accion'];
   
    showTable: boolean = false;
    

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

    /*setProgramStation () {
      const dialogRef = this.dialog.open(AddStationComponent, {
        height: '900px',
        width: '1000px',
      });
      this.alertService.clear();
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result.state) {
          this.showTable = false;
          this.uploadPrograms();
        }
      });
    }*/


    addProgram(): void {
    const dialogRef = this.dialog.open(AddProgramsComponent, {
      height: '900px',
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

      return element[column];
  }


}
