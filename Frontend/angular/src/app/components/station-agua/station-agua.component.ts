import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StationAgua } from 'src/app/models/station-agua/sation-agua.module';
import { StationAguaService } from 'src/app/services/microservice_agua/station-agua/station-agua.service';
import { AlertService } from '../alert';

@Component({
  selector: 'app-station-agua',
  templateUrl: './station-agua.component.html',
  styleUrls: ['./station-agua.component.css']
})
export class StationAguaComponent {
  
  constructor(  
    private alertService: AlertService,
    private stationAguaService: StationAguaService, 
    ) {
      
     }

     dataSource!: MatTableDataSource<StationAgua>;
     showTable: boolean = false;
     displayedColumns: string[] = ['estacion', 'descripcion', 'version'];

     
    ngOnInit(): void {
      this.uploadStation();
    }


     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      
      this.dataSource.filterPredicate = (data: StationAgua, filter: string) => {
        const dataStr = Object.values(data).join(' ').toLowerCase();
        const words = dataStr.split(' '); 
    
        return !filter || words.some(word => word.startsWith(filter)); 
      };
    
      this.dataSource.filter = filterValue;
    }

    uploadStation(): void {
      this.stationAguaService.getStations().subscribe({
        next: (resp) => {
          this.dataSource = new MatTableDataSource(resp);
          this.showTable = true;        
        },
        error: (err) => {
          this.alertService.error("Error obteniendo los programas ")
        }
      })
    }


     
}
