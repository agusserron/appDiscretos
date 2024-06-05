import { Component } from '@angular/core';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../../alert/alert.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-programs',
  templateUrl: './add-programs.component.html',
  styleUrls: ['./add-programs.component.css']
})
export class AddProgramsComponent {

  parametros : any; 
  availableOptions: string[] = [];
  selectedOptions: string[] = [];
  filteredOptions: string[] = [];
  searchTerm: string = '';
  idProgram : number = 0;

  displayedColumns: string[] = ['codigo', 'nombre', 'departamento'];
  estaciones: any;



  constructor(
    public dialogRef: MatDialogRef<AddProgramsComponent>,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private programService: ProgramService
  ) {
    this.setAllItems();
  }

  programFormGroup = this._formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    codigo:  ['', [Validators.required]],
    visiblePorExternos:  ['', [Validators.required]],
  });



  onNoClick(): void {
    this.dialogRef.close();
  }
    
  setAllItems(){
    this.setParametros();
    console.log(this.parametros)
    
  }

  setOptionParams() {
    this.availableOptions = []; 
    for (const parametro of this.parametros) {
      this.availableOptions.push(parametro.parametro);
    }
  }




  selectOption(option: string): void {
    if (!this.selectedOptions.includes(option)) {
      this.selectedOptions.push(option);
    }
  }

  removeOption(option: string): void {
    const index = this.selectedOptions.indexOf(option);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    }
  }

  setParametros(){
    this.programService.getParams().subscribe({
      next:(res) => {
        this.parametros = res;
        console.log(this.parametros)
        this.setOptionParams();
      },
      error:(err) => {
        this.alertService.error(err.error.message);
      }
    })
  } 

  filterOptions(searchTerm: string): void {
    this.filteredOptions = this.availableOptions.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  onSearchInputChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.filterOptions(searchTerm);
  }

  addProgram(){}
}
