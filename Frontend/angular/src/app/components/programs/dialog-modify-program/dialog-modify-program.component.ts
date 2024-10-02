import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../alert/alert.service';


interface Parametro {
  id_parametro: number;
  parametro: string;
  id_grupo: number;

}

@Component({
  selector: 'app-dialog-modify-program',
  templateUrl: './dialog-modify-program.component.html',
  styleUrls: ['./dialog-modify-program.component.css']
})

export class DialogModifyProgramComponent {

  constructor(private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private alertService: AlertService, 
    private programService: ProgramService, 
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogModifyProgramComponent>,
    ) {
    this.getParams();
    this.setValuesInst(data);     
    }

    programFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
      codigo: ['', [Validators.required]],
      visiblePorExternos: [''],     
      selectedGroup: [''],
      searchTerm: ['']
    });

     
     setValuesInst(dataPrograma: any): void {
      this.programFormGroup.patchValue({
        nombre: dataPrograma.nombre_programa,
        codigo: dataPrograma.codigo_programa,
        visiblePorExternos: dataPrograma.visible_externos
      });
    }

  
  parametrosDisponibles: any[] = []; 
  parametrosGuardados: any[] = []; 
  
  availableOptions: string[] = [];

  filteredOptions: Parametro[] = [];
  searchTerm: string = '';
  idProgram: number = 0;

  displayedColumns: string[] = ['codigo', 'nombre', 'departamento'];
  estaciones: any;


  selectedGroup: string = '';
  groups: { name: string, color: string, parameters: Parametro[] }[] = [];

  selectedOptions: { option: string, color: string, id_parametro: number}[] = [];

  

    clearAlert() {
      this.alertService.clear()
    }

    closeDialog(): void {
        this.dialogRef.close({ state: true });
    }

    modifyProgram() {}

   
 
    setAllItems() {
      this.setParametros();
    }

  
    getParams(): void {
      this.programService.getParamsProgram(this.data.id_programa).subscribe({
        next: (res: any) => {
          let param = res;
          console.log("PARAMETROS   " + param)
          this.setOptionParams();
        },
        error: (err) => {
          this.alertService.error(err.error.message);
        }
      });
    }

    setParametros() {
      this.programService.getParams().subscribe({
        next: (res: any[]) => {
          this.parametrosDisponibles = res; 
          this.setOptionParams(); 
        },
        error: (err) => {
          this.alertService.error(err.error.message);
        }
      });
    }

    setOptionParams() {
      if (!Array.isArray(this.parametrosDisponibles)) {
        console.error('parametrosDisponibles no es un array');
        return;
      }
      this.availableOptions = this.parametrosDisponibles.map(parametro => parametro.parametro);
    }

    setSelectedOptions() {
      this.selectedOptions = this.parametrosGuardados.map(param => ({
        option: param.parametro,
        color: this.getColorForGroup(param.id_grupo), 
        id_parametro: param.id_parametro
      }));
    }

    getParamsGuardados(): void {
    this.programService.getParamsProgram(this.data.id_programa).subscribe({
    next: (res: any[]) => {
      this.parametrosGuardados = res; 
      console.log("PARAMETROS   " + this.parametrosGuardados)
      this.setSelectedOptions(); 
    },
    error: (err) => {
      this.alertService.error(err.error.message);
    }
  });
}
  
  
    groupParamsByGroup(params: Parametro[]): { [key: string]: Parametro[] } {
      const grouped: { [key: string]: Parametro[] } = {};
  
      params.forEach(param => {
        const groupId = param.id_grupo.toString();
  
        if (!grouped[groupId]) {
          grouped[groupId] = [];
        }
  
        grouped[groupId].push(param);
      });
  
      return grouped;
    }
  
    
  
    getGroupName(groupId: number): string {
      switch (groupId) {
        case 1:
          return 'Biológicos';
        case 2:
          return 'Ecotoxicidad';
        case 3:
          return 'Físico-Químicos Generales';
        case 4:
          return 'Metálicos';
        case 5:
          return 'Inorgánicos no Metálicos';
        case 6:
          return 'Microbiológicos';
        case 7:
          return 'Orgánicos';
        case 8:
          return 'Orgánicos Generales';
        default:
          return 'Otro Grupo';
      }
    }
  
    getColorForGroup(groupId: number): string {
      switch (groupId) {
        case 1:
          return '#FFB6C1';
        case 2:
          return '#ADD8E6';
        case 3:
          return '#98FB98';
        case 4:
          return '#FFD700';
        case 5:
          return '#FFA07A';
        case 6:
          return '#87CEEB';
        case 7:
          return '#F0E68C';
        case 8:
          return '#FF69B4';
        default:
          return '#D3D3D3';
      }
    }
  
    filterOptions(searchTerm: string): void {
      this.filteredOptions = [];
      this.groups.forEach(group => {
        group.parameters.forEach(param => {
          if (param.parametro.toLowerCase().includes(searchTerm.toLowerCase())) {
            this.filteredOptions.push(param);
          }
        });
      });
    }
  
  
    onSearchInputChange(event: Event): void {
      const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
      const group = this.groups.find(group => group.name === this.selectedGroup);
      this.filteredOptions = group ? group.parameters.filter((param: Parametro) =>
        param.parametro.toLowerCase().includes(searchTerm)
      ) : [];
    }
  
    onGroupChange(event: any): void {
      this.selectedGroup = event.value;
      const group = this.groups.find(group => group.name === this.selectedGroup);
      this.filteredOptions = group ? group.parameters : [];
    }
  
  
  
    selectOption(option: string): void {
      const group = this.groups.find(group => group.name === this.selectedGroup);
      if (group) {
        const param = group.parameters.find(p => p.parametro === option);
        if (param && !this.selectedOptions.some(selected => selected.option === option)) {
          this.selectedOptions.push({ 
            option: param.parametro, 
            color: group.color, 
            id_parametro: param.id_parametro 
          });
        }
      }
    }
  
    removeOption(option: string): void {
      this.selectedOptions = this.selectedOptions.filter(selected => selected.option !== option);
    }
  
    getGroupColor(option: string): string {
      const group = this.groups.find(group => group.parameters.some(param => param.parametro === option));
      return group ? group.color : 'transparent';
    }
  
  
  
    selectAllOptionsInGroup(): void {
      const group = this.groups.find(group => group.name === this.selectedGroup);
      if (group) {
        group.parameters.forEach(param => {
          if (!this.selectedOptions.some(selected => selected.option === param.parametro)) {
            this.selectedOptions.push({ 
              option: param.parametro, 
              color: group.color, 
              id_parametro: param.id_parametro 
            });
          }
        });
      }
    }
  
    isSelected(parametro: string): boolean {
      return this.selectedOptions.some(selected => selected.option === parametro);
    }
  
  

     
}
