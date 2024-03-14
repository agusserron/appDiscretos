import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StationService } from 'src/app/services/microservice_aire/station/station.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  dataStation! : any;

  constructor(
    public dialogRef: MatDialogRef<InfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stationService: StationService,
  ){
    this.dataStation = this.data;
    console.log(this.dataStation);
    console.log(this.dataStation.userStatus);
  }

  onNoClick(): void {
   this.dialogRef.close();
  }

  
}
