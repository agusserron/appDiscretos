import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Company } from 'src/app/models/company/company.module';
import { PlantToAdd } from 'src/app/models/plant/plant.module';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { PlantService } from 'src/app/services/microservice_aire/plant/plant.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.css']
})
export class AddPlantComponent implements OnInit {

  departamentos : any;
  nroEnlaces: any = [];
  nameCompanys: any = [];
  filteredOptions!: Observable<Company[]>;

  constructor(
    public dialogRef: MatDialogRef<AddPlantComponent>,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private plantService: PlantService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.uploadCompany();
    this.uploadNroEnlaces();
    this.uploadDepartaments();
    this.filteredOptions = this.plantFormGroup.controls['nombreEmpresa'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

  plantFormGroup = this._formBuilder.group({
    nombreEmpresa: ['', Validators.required],
    nombrePlanta: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    nroEnlace: ['', Validators.required],
    direccion: ['', [Validators.required,Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    departamento: [0,Validators.required]
  });

  exit(): void {
    this.dialogRef.close();
  }
    
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.nameCompanys.filter((company: any) => company.nombre.toLowerCase().includes(filterValue));
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
          /*setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);*/
        }
      }
    });
  }

  uploadDepartaments(): void {
    this.plantService.getDepartaments().subscribe({
      next: (resp) => {
        this.departamentos = resp;
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
          /*setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);*/
        }
      }
    });
  }

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.plantFormGroup.controls[controlName as keyof typeof this.plantFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  validateAndAddPlant() {
    this.alertService.clear();
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

  addPlant(plant:PlantToAdd): void {
    this.plantService.addPlant(plant).subscribe({
      next: (resp) => {
        this.alertService.success(resp.message, this.options);
        setTimeout(() => {
          this.dialogRef.close({state:true});
        }, 1000)
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
         /* setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);*/
        }
        else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
        else this.alertService.error("Error agregando planta");
      }
    })
  }
  
}
