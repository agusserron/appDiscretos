import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { estados} from 'src/app/models/common.module';
import { InstitucionAguaEdit } from 'src/app/models/instituciones-agua/instituciones-agua.module';
import { InstitucionAguaService } from 'src/app/services/microservice_agua/instituciones-agua/instituciones-agua.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-dialog-modify',
  templateUrl: './dialog-modify.component.html',
  styleUrls: ['./dialog-modify.component.css']
})

export class DialogEditarInstAguaComponent {

  nombre : any;
  estados = estados;


  constructor(
    public dialogRef: MatDialogRef<DialogEditarInstAguaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private institucionAguaService: InstitucionAguaService
  ) {
    this.setValuesInst(data);
  }


//para meter los valores en el formulario  
  setValuesInst(dataInstitucion: any): void {
    this.institucionFormGroup.patchValue({
      nombre: dataInstitucion.nombre,
      estado: dataInstitucion.estado == 0 ? 'Inactiva' : 'Activa'
    })
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

 
  editInstitucion(): void {
    console.log(this.data)
    const form = this.institucionFormGroup.value;
    let editInstitucion = new InstitucionAguaEdit(
      this.data.id_institucion,
      form.nombre!,
      form.estado!
    )
  
    if(this.validateInstitucion()){
      this.institucionAguaService.editInstitucion(editInstitucion).subscribe({
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
