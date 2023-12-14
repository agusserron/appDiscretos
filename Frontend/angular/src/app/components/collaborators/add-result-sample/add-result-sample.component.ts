import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AguaService } from 'src/app/services/microservice_agua/agua/agua.service';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';

@Component({
  selector: 'app-add-result-sample',
  templateUrl: './add-result-sample.component.html',
  styleUrls: ['./add-result-sample.component.css']
})
export class AddResultSampleComponent {

  matrices: any = [];
  departamentos: any = [];
  programas: any = [];

  constructor(private _formBuilder: FormBuilder, 
    private programService: ProgramService,
    private stationService: StationService,
    private aguaService: AguaService
    ){}

  ngOnInit(){
    this.getPrograms();
    this.getDepartaments();
    this.getMatrices();
  }

  registerExcelForm = this._formBuilder.group({
    matriz: ['', Validators.required],
    departamento: ['', Validators.required],
    program: ['', Validators.required]
  });

  getPrograms(){
    this.programService.getPrograms().subscribe({
      next:(value) => {
        this.programas = value;
      },
      error:(err) => {
      }
    })
  }

  getDepartaments(){
    this.stationService.getDepartaments().subscribe({
      next:(value) => {
        this.departamentos = value;
      },
      error:(err) => {
      }
    })
  }

  getMatrices(){
    this.aguaService.getMatrices().subscribe({
      next:(value) => {
        this.matrices = value;
      },
      error:(err) => {
      }
    })
  }
}
