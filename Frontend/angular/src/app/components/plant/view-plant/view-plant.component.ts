import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { departamentos } from 'src/app/models/common.module';
import { Company } from 'src/app/models/company/company.module';
import { IPlant, PlantToAdd } from 'src/app/models/plant/plant.module';
import { AireService } from 'src/app/services/microservice_aire/aire/aire.service';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { PlantService } from 'src/app/services/microservice_aire/plant/plant.service';
import { AlertService } from '../../alert';
import { AddPlantComponent } from '../add-plant/add-plant.component';


@Component({
  selector: 'app-plant',
  templateUrl: './view-plant.component.html',
  styleUrls: ['./view-plant.component.css']
})


export class PlantComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, 
    private aireService: AireService, 
    private companyService: CompanyService,
    private plantService: PlantService,
    public alertService: AlertService, 
    private router: Router,
    public dialog: MatDialog
    ) { }

  dataSource!: MatTableDataSource<IPlant>;
  displayedColumns: string[] = ['nombre', 'nroEnlace', 'direccion', 'nombreEmpresa', 'departamento'];
  filteredOptions!: Observable<Company[]>;
  nameCompanys: any = [];
  nroEnlaces: any = [];
  buttonShow: boolean = true;
  showAdd: boolean = false;
  departamentos : any = departamentos;
  showTable: boolean = false;

  ngOnInit(): void {
    this.uploadCompany();
    this.uploadNroEnlaces();
    this.uploadPlants();
    this.filteredOptions = this.plantFormGroup.controls['nombreEmpresa'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

/*
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
*/

/* primeros caracteres */
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const dataStr = Object.values(data).join(' ').toLowerCase();
    const words = dataStr.split(' '); // parto los strings en pedazos

    return !filter || words.some(word => word.startsWith(filter)); // miro si alguna palabra empieza con el filtro
  };

  this.dataSource.filter = filterValue;
}





  customCellLogicFunction(element: any, column: any): any {
    if(column == "nroEnlace"){
    return element.nroEnlace !== '0' ? element.nroEnlace : '-';
    }
    return element[column]
  }

  uploadPlants(): void {
    this.plantService.getPlants().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.showTable = true;
      },
      error: err => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
        }
      }
    });
  }

  uploadCompany(): void {
    this.companyService.getCompanys().subscribe({
      next: (resp) => {
        this.nameCompanys = resp;
      },
      error: err => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  uploadNroEnlaces(): void {
    this.plantService.getAllNroEnlaces().subscribe({
      next: (resp) => {
        this.nroEnlaces = resp;
      },
      error: err => {
        if (err.status == 0) {
          this.alertService.clear();
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.nameCompanys.filter((company: any) => company.nombre.toLowerCase().includes(filterValue));
  }

  plantFormGroup = this._formBuilder.group({
    nombreEmpresa: ['', Validators.required],
    nombrePlanta: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    nroEnlace: ['', Validators.required],
    direccion: ['', [Validators.required,Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    departamento: [0, Validators.required]
  });

  onFinish() {
    this.alertService.clear();
    this.validateAndAddPlant();
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  showAddPlant(): void {
    const dialogRef = this.dialog.open(AddPlantComponent, {
      height: '460px',
      width: '600px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadPlants();
      }
    });
  }

  back(): void {
    this.showAdd = false;
    this.buttonShow = true;
  }

  addPlant(plant:PlantToAdd): void {
    this.plantService.addPlant(plant).subscribe({
      next: (resp) => {
        this.alertService.success(resp.message, this.options);
        this.plantFormGroup.reset();
        this.uploadPlants();
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
        else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
        else this.alertService.error("Error agregando planta");
      }
    })
  }

  showError(controlName: string, errorMessage: string) : void {
    this.alertService.error(errorMessage, this.options);
    const control = this.plantFormGroup.controls[controlName as keyof typeof this.plantFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
  }

  validateAndAddPlant() {
    if (this.plantFormGroup.value.nombreEmpresa == "" || !this.plantFormGroup.value.nombreEmpresa) {
      this.showError('nombreEmpresa',"Debe ingresar un nombre de empresa");
    }
    else if (this.plantFormGroup.value.nombrePlanta == "" || !this.plantFormGroup.value.nombrePlanta) {
      this.showError('nombrePlanta',"Debe ingresar un nombre de planta");
    }
    else if (this.plantFormGroup.controls['nombrePlanta'].hasError('pattern')) {
      this.showError('nombrePlanta',"Debe ingresar una nombre de planta válida");
    }
    else if (this.plantFormGroup.value.nroEnlace == "" || !this.plantFormGroup.value.nroEnlace) {
      this.showError('nroEnlace',"Debe ingresar un número de enlace");
    }
    else if (this.plantFormGroup.value.direccion == "" || !this.plantFormGroup.value.direccion) {
      this.showError('direccion',"Debe ingresar una dirección");
    }
    else if (this.plantFormGroup.controls['direccion'].hasError('pattern')) {
      this.showError('direccion',"Debe ingresar una dirección válida");
    }
    else if (this.plantFormGroup.value.departamento == 0 || !this.plantFormGroup.value.departamento) {
      this.showError('departamento',"Debe ingresar un departamento");
    }
    else if (this.nameCompanys.filter((e: any) => e.nombre === this.plantFormGroup.value.nombreEmpresa).length == 0) {
      this.alertService.error("Debe seleccionar una empresa existente", this.options);
      this.plantFormGroup.controls['nombreEmpresa'].setValue('');
      this.plantFormGroup.controls['nombreEmpresa'].markAsTouched();
    }
    else if (this.nroEnlaces.filter((e: any) => e.nroEnlace == this.plantFormGroup.value.nroEnlace).length > 0) {
      this.alertService.error("El número de enlace ya esta asociado a una planta", this.options);
      this.plantFormGroup.controls['nroEnlace'].setValue('');
      this.plantFormGroup.controls['nroEnlace'].markAsTouched();
    }
    else {
      let empresa = this.nameCompanys.find((c: any) => c.nombre == this.plantFormGroup.value.nombreEmpresa)
      let plant = new PlantToAdd(
        this.plantFormGroup.value.nombrePlanta.toUpperCase(),
        this.plantFormGroup.value.nroEnlace,
        this.plantFormGroup.value.direccion.toUpperCase(),
        this.plantFormGroup.value.departamento,
        empresa.id
      )
      this.addPlant(plant);
    }
  }

}
