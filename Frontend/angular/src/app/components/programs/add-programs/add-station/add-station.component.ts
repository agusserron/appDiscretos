import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AddProgramsComponent } from '../add-programs.component';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { MatTableDataSource } from '@angular/material/table';
import { Station } from 'src/app/models/program/program.module';

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.css']
})
export class AddStationComponent {



  constructor(
    public dialogRef: MatDialogRef<AddStationComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private programService: ProgramService
  ) {
  
    console.log('Received data:', data);
    console.log ('programa:  ' + data.element.id_programa)
    this.idProgram = data.element.id_programa;  
    this.setProgramStation();
  }

  dataSource!: MatTableDataSource<Station>;
  displayedColumns: string[] = ['estacion', 'descripcion'];
  stations : any;
  idProgram : any;
  showTable: boolean = false;


  onNoClick(): void {
    this.dialogRef.close();
  }
  
  setProgramStation () {
    this.idProgram = this.data.element.id_programa;
    this.programService.getProgramStation(this.idProgram).subscribe({
      next: (res) => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res);
        this.showTable = true;
        this.stations = res;
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    });
  }

 

  addStation(){}


}
