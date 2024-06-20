import { Component } from '@angular/core';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../../alert/alert.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

interface Parametro {
  id_parametro: number;
  parametro: string;
  id_grupo: number;

}

interface Parametro {
  id_parametro: number;
  parametro: string;

}


@Component({
  selector: 'app-add-programs',
  templateUrl: './add-programs.component.html',
  styleUrls: ['./add-programs.component.css']
})


export class AddProgramsComponent {

  parametros: any;
  availableOptions: string[] = [];

  filteredOptions: Parametro[] = [];
  searchTerm: string = '';
  idProgram: number = 0;

  displayedColumns: string[] = ['codigo', 'nombre', 'departamento'];
  estaciones: any;


  selectedGroup: string = '';
  groups: { name: string, color: string, parameters: Parametro[] }[] = [];

  selectedOptions: { option: string, color: string }[] = [];



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
    codigo: ['', [Validators.required]],
    visiblePorExternos: ['', [Validators.required]],
  });



  onNoClick(): void {
    this.dialogRef.close();
  }

  setAllItems() {
    this.setParametros();
    console.log(this.parametros)

  }

  setOptionParams() {
    this.availableOptions = [];
    for (const parametro of this.parametros) {
      this.availableOptions.push(parametro.parametro);
    }
  }

  setParametros() {
    this.programService.getParams().subscribe({
      next: (res: Parametro[]) => {
        const groupedParams = this.groupParamsByGroup(res);

        this.groups = Object.keys(groupedParams).map((groupId: string) => ({
          name: this.getGroupName(Number(groupId)),
          color: this.getColorForGroup(Number(groupId)),
          parameters: groupedParams[groupId]
        }));

        console.log('Grupos finales:', this.groups);
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      }
    })
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
    if (group && !this.selectedOptions.some(selected => selected.option === option)) {
      this.selectedOptions.push({ option, color: group.color });
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
          this.selectedOptions.push({ option: param.parametro, color: group.color });
        }
      });
    }
  }

  isSelected(parametro: string): boolean {
    return this.selectedOptions.some(selected => selected.option === parametro);
  }

  addProgram() { }
}
