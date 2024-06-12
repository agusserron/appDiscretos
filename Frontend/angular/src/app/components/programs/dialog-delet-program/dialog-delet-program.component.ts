import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProgramService } from 'src/app/services/microservice_agua/programs/program.service';
import { AlertService } from '../../alert';
import { DialogDeleteComponent } from '../../station/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-dialog-delet-program',
  templateUrl: './dialog-delet-program.component.html',
  styleUrls: ['./dialog-delet-program.component.css']
})
export class DialogDeletProgramComponent {
  data!: any

  constructor(
    public dialogRef: MatDialogRef<DialogDeletProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProgram: any,
    private programService: ProgramService,
    public alertService: AlertService
  ){
    this.data = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteData() : void {
 
    this.alertService.clear();
    this.programService.deleteProgram(this.data.codigo).subscribe({
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
