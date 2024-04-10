import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-dialog-delet-data',
  templateUrl: './dialog-delet-data.component.html',
  styleUrls: ['./dialog-delet-data.component.css']
})
export class DialogDeletDataComponent {
  dataStation! : any;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stationService: StationService,
    public alertService: AlertService
  ){
    this.dataStation = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteData() : void {
 
    this.alertService.clear();
    this.stationService.deleteStationData(this.dataStation.idReporte).subscribe({
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


