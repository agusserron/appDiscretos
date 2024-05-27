import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/models/company/company.module';
import { AireService } from 'src/app/services/microservice_aire/aire/aire.service';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { AlertService } from '../../alert';
import { AddCompanyComponent } from '../add-company/add-company.component';

@Component({
  selector: 'app-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, 
    private alertService: AlertService, 
    private aireService: AireService, 
    private companyService: CompanyService,
    public dialog: MatDialog
    ) { }

  dataSource!: MatTableDataSource<Company>;
  displayedColumns: string[] = ['nombre', 'rut', 'direccion'];
  showTable: boolean = false;

  ngOnInit(): void {
    this.uploadCompanys();
  }

  companyFormGroup = this._formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    rut: ['', Validators.required],
    direccion: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]]
  });

  showAddCompany(): void {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      height: '400px',
      width: '600px',
    });
    this.alertService.clear();
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.state) {
        this.showTable = false;
        this.uploadCompanys();
      }
    });
  }

  uploadCompanys(): void {
    this.companyService.getCompanys().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.showTable = true;
      },
      error: (err) => {
        this.alertService.error("Error obteniendo las empresas", this.options)
      }
    })
  }

  customCellLogicFunction(element: any, column:  any): any {
    if(column == "direccion"){
    return element.direccion !== '' ? element.emp_direccion : '-';
    }
    return element[column]
  }

 /* original */
 /*
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
*/

/* primeros caracteres */
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
  this.dataSource.filterPredicate = (data: Company, filter: string) => {
    const dataStr = Object.values(data).join(' ').toLowerCase();
    const words = dataStr.split(' '); // parto los strings en pedazos

    return !filter || words.some(word => word.startsWith(filter)); // miro si alguna palabra empieza con el filtro
  };

  this.dataSource.filter = filterValue;
}




  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

}


