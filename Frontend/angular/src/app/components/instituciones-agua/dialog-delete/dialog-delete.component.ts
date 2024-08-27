import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstitucionAguaService } from 'src/app/services/microservice_agua/instituciones-agua/instituciones-agua.service';
import { AlertService } from '../../alert';


@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})

export class DialogDeleteInstAguaComponent {

  dataInstitucion! : any;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteInstAguaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private _formBuilder: FormBuilder,
    public alertService: AlertService,
    private institucionAguaService: InstitucionAguaService
  ) {
    this.dataInstitucion = this.data;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  delInstitucion() : void {
    this.alertService.clear();
    this.institucionAguaService.delInstitucion(this.dataInstitucion.id_institucion).subscribe({
      next:(res:any) => {
        this.alertService.success(res.message);
        setTimeout(()=> {
          this.dialogRef.close({state:true});
        },1000)
      },
      error:(err:any) => {
        this.alertService.error(err.error.message);
      }
    })
  }

}
