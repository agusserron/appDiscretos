import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { estados} from 'src/app/models/common.module';
import { InstitucionAgua } from 'src/app/models/instituciones-agua/instituciones-agua.module';
import { InstitucionAguaService } from 'src/app/services/microservice_agua/instituciones-agua/instituciones-agua.service';
import { AlertService } from '../../alert';


@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.css']
})
export class DialogAgregarInstAguaComponent {

  nombre : any;
  estados = estados;

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarInstAguaComponent>,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private institucionAguaService: InstitucionAguaService
  ) {
    
  }

  institucionFormGroup = this._formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    estado: ['', Validators.required]
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
    
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.institucionFormGroup.controls[controlName as keyof typeof this.institucionFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  validateInstitucion(): boolean {
    this.alertService.clear();
    const form = this.institucionFormGroup.value;
    if (!form.nombre) {
      return this.showError("nombre", "Debe ingresar un nombre para la Institución");
    }
    else if (!form.estado) {
      return this.showError("estado", "Debe ingresar un estado");
    }
    return true;
  }

 
  addInstitucion(): void {
    const form = this.institucionFormGroup.value;
    let newInstitucion = new InstitucionAgua(
      form.nombre!,
      form.estado!
    )
  
    if(this.validateInstitucion()){
      this.institucionAguaService.addInstitucion(newInstitucion).subscribe({
        next:(res) => {
          this.alertService.success(res.message);
          setTimeout(() => {
            this.dialogRef.close({state:true});
          },1000)
        },
        error:(err) => {
          this.alertService.error(err.error.message);
        }
      })
    } 
  }

}
