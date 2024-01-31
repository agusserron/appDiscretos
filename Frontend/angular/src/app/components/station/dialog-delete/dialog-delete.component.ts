import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent {

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

  deleteStation() : void {
    this.alertService.clear();
    this.stationService.deleteStation(this.dataStation.codigo).subscribe({
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
