import { Component } from '@angular/core';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../../alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StationAguaService } from 'src/app/services/microservice_agua/station-agua/station-agua.service';
import { StationAgua } from 'src/app/models/station-agua/sation-agua.module';
import { from, switchMap } from 'rxjs';
import { AguaService } from 'src/app/services/microservice_agua/agua/agua.service';
import { Program } from 'src/app/models/program/program.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // También necesitas MatInputModule para los inputs



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

  isLinear: boolean = true;

  parametros: any;
  availableOptions: string[] = [];

  filteredOptions: Parametro[] = [];
  searchTerm: string = '';
  idProgram: number = 0;

  displayedColumns: string[] = ['codigo', 'nombre', 'departamento'];
  estaciones: any;


  selectedGroup: string = '';
  groups: { name: string, color: string, parameters: Parametro[] }[] = [];

  selectedOptions: { option: string, color: string, id_parametro: number}[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  //ESTACIONES

  opciones: any[] = [];
  tipoPunto: any[] = [];
  matrices: any[] = [];
  idMatriz!: number;
  idProgrma!: number;
  idDepartamento!: number;
  idTipoPunto!: number;

  departamentos: any[] = [];
  subCuenca: any;
  existeEstacion: Boolean = false;
  estacion!: StationAgua;

 
 

  stationFormGroup = this._formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    punto: [null, Validators.required],
    matriz: [null, Validators.required],
    departamento: [null, Validators.required],
    ingresoInterno: [false],
    latitud: [null, Validators.required],
    longitud: [null, Validators.required],
    subcuenca: ['', Validators.required],
    cuenca: ['', Validators.required],
  });

  

  constructor(
    public dialogRef: MatDialogRef<AddProgramsComponent>,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private programService: ProgramService,
    private stationAguaService: StationAguaService,
    private aguaService: AguaService,
    
  ) {
    this.setAllItems();
    this.firstFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
      codigo: ['', [Validators.required]],
      visiblePorExternos: [''],
      parametros: this._formBuilder.array([])      
    });
    this.secondFormGroup = this._formBuilder.group({
      
    });
    
  }

  
  ngOnInit() {
    this.getTipoPunto();
    this.getMatrices();
    this.getDepartamentos();
  }

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
      this.availableOptions.push(parametro);
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



validateProgram(): boolean {
  this.alertService.clear();
  if (this.firstFormGroup.value.nombre == "" || !this.firstFormGroup.value.nombre) {
    return this.showError('nombre', "Debe ingresar un nombre de programa");
  } else if (this.firstFormGroup.controls['nombre'].hasError('pattern')) {
    return this.showError('nombre', "Debe ingresar un nombre de programa válido");
  } else if (this.firstFormGroup.value.codigo == "" || !this.firstFormGroup.value.codigo) {
    return this.showError('codigo', "Debe ingresar un código de programa");
  }
  return true;
}

validateAndAddProgram(): void {
  this.parametros = this.selectedOptions;
  let visible = this.firstFormGroup.value.visiblePorExternos ? 1 : 0;

  const codigo = this.firstFormGroup.value.codigo;
  const nombre = this.firstFormGroup.value.nombre;

  if (!this.validateProgram()) {
    return;
  }

  const programa = new Program(
    nombre!,
    codigo!,
    visible,
    0,
    this.parametros
  );

  this.programService.addProgram(programa).subscribe({
    next: (resp) => {
      this.idProgram = resp.id;
      this.alertService.success("Programa agregado exitosamente", this.options);
    },
    error: (err) => {
      if (err.status === 0) {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
      } else if (err.status === 400) {
        this.alertService.error(err.error.message, this.options);
      } else if (err.status === 409) {
        this.alertService.error(err.error.message, this.options);
      }
    }
  });
}




///ESTACIONES 
validateStation(): boolean {
  this.alertService.clear();
  if (this.stationFormGroup.value.nombre == "" || !this.stationFormGroup.value.nombre) {
    return this.showError('nombre', "Debe ingresar un nombre");
  }
  else if (this.stationFormGroup.controls['nombre'].hasError('pattern')) {
    return this.showError('nombre', "Debe ingresar un nombre válido");
  }
  else if (this.stationFormGroup.value.codigo == "" || !this.stationFormGroup.value.codigo) {
    return this.showError('codigo', "Debe ingresar un código");
  }
  else if (!this.stationFormGroup.value.punto) {
    return this.showError('punto', "Debe seleccionar un punto");
  }
  else if (!this.stationFormGroup.value.matriz) {
    return this.showError('matriz', "Debe seleccionar una matriz");
  }
  else if (!this.stationFormGroup.value.departamento) {
    return this.showError('departamento', "Debe seleccionar un departamento");
  }
  else if (!this.stationFormGroup.value.latitud) {
    return this.showError('latitud', "Debe ingresar una latitud");
  }
  else if (!this.stationFormGroup.value.longitud) {
    return this.showError('longitud', "Debe ingresar una longitud");
  }
  else if (this.stationFormGroup.value.subcuenca == "" || !this.stationFormGroup.value.subcuenca) {
    return this.showError('subcuenca', "Debe ingresar una subcuenca");
  }
  else if (this.stationFormGroup.value.cuenca == "" || !this.stationFormGroup.value.cuenca) {
    return this.showError('cuenca', "Debe ingresar una cuenca");
  }
  return true;
}

options = {
  autoClose: true,
  keepAfterRouteChange: false
};


showError(controlName: string, errorMessage: string): boolean {
  this.alertService.error(errorMessage, this.options);
  const control = this.stationFormGroup.controls[controlName as keyof typeof this.stationFormGroup.controls];
  if (control) {
    control.markAsTouched();
  }
  return false;
}


addStationAgua(): void {
  const form = this.stationFormGroup.value;

  const latitud = this.stationFormGroup.get('latitud')?.value;
  const longitud = this.stationFormGroup.get('longitud')?.value;

  const latitudNumber = latitud !== null && latitud !== undefined ? parseFloat(latitud) : NaN;
  const longitudNumber = longitud !== null && longitud !== undefined ? parseFloat(longitud) : NaN;
 
  const newStation = new StationAgua(
    form.codigo!,
    form.nombre!,
    Number(latitudNumber),   
    Number(longitudNumber), 
    Number(this.idProgram),
    0,
    Number(form.punto!),
    Number(form.departamento!),
    this.subCuenca.sub_cue_cuenca_id,
    form.ingresoInterno == true ? 1 : 0,
    Number(form.matriz!),
  );
  console.log("estacion "+ newStation)
  try {

    if (this.validateStation()) {
      this.stationAguaService.addStationAgua(newStation).subscribe({
        next: (res) => {
          this.alertService.success(res.message);
          setTimeout(() => {
            this.dialogRef.close({ state: true });
          }, 1000);
        },
        error: (err) => {
          this.alertService.error(err.error.message);
        }
      });
    }
  } catch (error) {
    console.error('Error en existStation:', error);
    this.alertService.error('Error al verificar la existencia de la estación.');
  }
}

getTipoPunto() {
  this.stationAguaService.getTypePoint().subscribe({
    next: (res) => {
      this.tipoPunto = res;

    },
    error: (err) => {
      this.alertService.error(err.error.message);
    }
  })

}

getMatrices() {
  this.aguaService.getMatrices().subscribe({
    next: (res) => {
      this.matrices = res;
    },
    error: (err) => {
      this.alertService.error(err.error.message);
    }
  })

}

getDepartamentos() {
  this.aguaService.getDepartamentos().subscribe({
    next: (res) => {
      this.departamentos = res;
      console.log(this.departamentos)
    },
    error: (err) => {
      this.alertService.error(err.error.message);
    }
  })

}

setSubcuenca() {
  const latitud = this.stationFormGroup.get('latitud')?.value;
  const longitud = this.stationFormGroup.get('longitud')?.value;

  this.stationAguaService.getSubcuenca(latitud, longitud).pipe(
    switchMap((res) => {
      this.subCuenca = res;
      return this.stationAguaService.getCuencaById(this.subCuenca.sub_cue_cuenca_id);
    })
  ).subscribe({
    next: (cuencaNombre) => {
      this.stationFormGroup.patchValue({
        subcuenca: this.subCuenca.sub_cue_nombre,
        cuenca: cuencaNombre[0].cue_nombre
      });
    },
    error: (err) => {
      if (err.status == 0) {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
      }
      else if (err.status == 400) {
        this.alertService.error(err.error.message, this.options);
      }
    }
  });
}



}