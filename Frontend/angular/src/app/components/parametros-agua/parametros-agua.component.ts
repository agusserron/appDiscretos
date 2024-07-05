import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ParametrosAgua } from 'src/app/models/parametros-agua/parametros-agua.module';
import { ParametrosAguaService } from 'src/app/services/microservice_agua/parametros-agua/parametros-agua.service';
import { AlertService } from '../alert';

@Component({
  selector: 'app-parametros-agua',
  templateUrl: './parametros-agua.component.html',
  styleUrls: ['./parametros-agua.component.css']
})
export class ParametrosAguaComponent {
  
  constructor(  
    private alertService: AlertService,
    private ParametrosAguaService: ParametrosAguaService, 
    ) {
      
     }

     dataSource!: MatTableDataSource<ParametrosAgua>;
     showTable: boolean = false;
     displayedColumns: string[] = ['param_nombre', 'param_nomclave', 'param_enum', 'matriz_detalle'];

     
    ngOnInit(): void {
      this.uploadParametros();
    }


     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      
      this.dataSource.filterPredicate = (data: ParametrosAgua, filter: string) => {
        const dataStr = Object.values(data).join(' ').toLowerCase();
        const words = dataStr.split(' '); 
    
        return !filter || words.some(word => word.startsWith(filter)); 
      };
    
      this.dataSource.filter = filterValue;
    }

    uploadParametros(): void {
      this.ParametrosAguaService.getParametrosAgua().subscribe({
        next: (resp) => {
          this.dataSource = new MatTableDataSource(resp);
          this.showTable = true;        
        },
        error: (err) => {
          this.alertService.error("Error obteniendo parametros ")
        }
      })
    }


     
}
