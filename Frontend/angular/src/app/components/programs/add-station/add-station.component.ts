import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/components/alert/alert.service';
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
  
    this.departamentos = {
      1: 'ARTIGAS',
      2: 'CANELONES',
      3: 'CERRO LARGO',
      4: 'COLONIA',
      5: 'DURAZNO',
      6: 'FLORES',
      7: 'FLORIDA',
      8: 'LAVALLEJA',
      9: 'MALDONADO',
      10: 'MONTEVIDEO',
      11: 'PAYSANDÚ',
      12: 'RÍO NEGRO',
      13: 'RIVERA',
      14: 'ROCHA',
      15: 'SALTO',
      16: 'SAN JOSÉ',
      17: 'SORIANO',
      18: 'TACUAREMBÓ',
      19: 'TREINTA Y TRES'
    };
    this.idProgram = data.element.id_programa;  
    this.setProgramStation();
  }

  dataSource!: MatTableDataSource<Station>;
  displayedColumns: string[] = ['estacion', 'descripcion', 'id_departamento'];
  stations : any;
  idProgram : any;
  showTable: boolean = false;
  departamentos: { [key: number]: string };


  columnHeaders: { [key: string]: string } = {
    estacion: 'Estación',
    descripcion: 'Descripción',
    id_departamento: 'Departamento',
  };


  closeDialog(): void {
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


  customCellLogicFunction = (element: any, column: any) => {
    if (column === "id_departamento") {
      return this.departamentos[element.id_departamento] || element.id_departamento;
    }
    return element[column];
  }

  addStation(){}


}
