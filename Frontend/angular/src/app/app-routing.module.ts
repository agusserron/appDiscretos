import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AireComponent } from './components/industry/aire/aire.component';
import { CompanyComponent } from './components/company/view-company/view-company.component';
import { DataComponent } from './components/industry/data/data.component';
import { HomeStationComponent } from './components/station/home-station/home-station.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlantComponent } from './components/plant/view-plant/view-plant.component';
import { AuthGuard } from './guards/auth.guard';
import { IndustryComponent } from './components/industry/home-industry/home-industry.component';
import { AddResultSampleComponent } from './components/collaborators/add-result-sample/add-result-sample.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { StationAguaComponent } from './components/station-agua/station-agua.component';


export const routes: any = [
  {path: 'login', component: LoginComponent},
  {path: 'SRD', component: HomeComponent, canActivate: [AuthGuard], children:[
    {path: 'company', component: CompanyComponent, label: 'EMPRESAS'},
    {path: 'aire', component: AireComponent},
    {path: 'industry', component: IndustryComponent},
    {path: 'plant', component: PlantComponent},
    {path: 'data', component: DataComponent},
    {path: 'station', component: HomeStationComponent},
    {path: 'collaborators', component: AddResultSampleComponent},
    {path: 'programs', component:  ProgramsComponent},
    {path: 'station-agua', component: StationAguaComponent}
    
    
  ]},
  {path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }