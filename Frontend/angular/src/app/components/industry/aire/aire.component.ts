import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Aire } from 'src/app/models/aire/aire.module';
import { Frecuencia, frecuencias, Metodologia, metodologias, Parametro, parametros, tiposMonitoreos, Unidad, unidades } from 'src/app/models/common.module';
import { Company } from 'src/app/models/company/company.module';
import { AireService } from 'src/app/services/microservice_aire/aire/aire.service';
import { CompanyService } from 'src/app/services/microservice_aire/company/company.service';
import { PlantService } from 'src/app/services/microservice_aire/plant/plant.service';
import { AlertService } from '../../alert';

@Component({
  selector: 'app-aire',
  templateUrl: './aire.component.html',
  styleUrls: ['./aire.component.css']
})


export class AireComponent implements OnInit {

  nameCompanys: any = [];
  filteredOptions!: Observable<Company[]>;
  filteredOptionsNroEnlace!: Observable<string[]>;
  nroEnlaces: any = [];
  isLinear: boolean = true;
  idPlant: number = 0;
  parametros: any;
  unidades: any;
  frecuencias: Frecuencia[] = frecuencias;
  tiposMonitoreos: Frecuencia[] = tiposMonitoreos;
  metodologias: Metodologia[] = metodologias;
  metodologiaOtro: boolean = false;

  constructor(private _formBuilder: FormBuilder, 
    public alertService: AlertService, 
    private aireService: AireService, 
    private plantService: PlantService,
    private companyService: CompanyService,
    private router: Router) { }

  ngOnInit(): void {
    this.alertService.clear();
    this.disableInputs();
    this.getCompanys();
    this.getParameters();
    this.getUnits();
    this.filteredOptions = this.firstFormGroup.controls['nombreCtrl'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    )
  }

  disableInputs(): void {
    this.firstFormGroup.controls['nombrePlantCtrl'].disable();
    this.firstFormGroup.controls['direccionPlantCtrl'].disable();
    this.firstFormGroup.controls['departamentoPlantCtrl'].disable();
  }

  private getCompanys(): void {
    this.companyService.getCompanys().subscribe({
      next: (resp) => {
        this.nameCompanys = resp;
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
        if (err.status == 0) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  private getParameters(): void {
    this.aireService.getParameters().subscribe({
      next: (resp) => {
        this.parametros = resp;
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
        if (err.status == 0) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  private getUnits(): void {
    this.aireService.getUnits().subscribe({
      next: (resp) => {
        this.unidades = resp;
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error("Servicio sin conexión", this.options);
        if (err.status == 0) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        }
      }
    });
  }

  private getNroEnlaces(): void {
    let nombreEmpresa = this.firstFormGroup.value.nombreCtrl || '';
    this.companyService.getNroEnlaces(nombreEmpresa).subscribe({
      next: (resp) => {
        this.nroEnlaces = resp.nroEnlaces;
        this.filteredOptionsNroEnlace = this.firstFormGroup.controls['nroEnlaceCtrl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filterNroEnlace(value || '')),
        )
      },
      error: (err) => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        } else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
        else this.alertService.error("Error obteniendo números de enlace");
      }
    });
  }

  onSelectionMetodologia(): void {
    this.secondFormGroup.value.metodologiaMuestreoCtrl == 'Otro' ? this.metodologiaOtro = true : this.metodologiaOtro = false;
  }

  private _filterNroEnlace(value: string): string[] {
    const filterValue = value;
    return this.nroEnlaces.filter((value: string) => value.startsWith(filterValue));
  }

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.nameCompanys.filter((company: any) => company.nombre.toLowerCase().includes(filterValue));
  }

  setNrosEnlaces(): void {
    this.getNroEnlaces();
  }

  firstFormGroup = this._formBuilder.group({
    nombreCtrl: ['', Validators.required],
    nroEnlaceCtrl: ['', Validators.required],
    nombrePlantCtrl: [''],
    direccionPlantCtrl: [''],
    departamentoPlantCtrl: ['']
  });
  secondFormGroup = this._formBuilder.group({
    nombrePunto: ['', Validators.required],
    latitudCtrl: ['', [Validators.required, Validators.pattern("[0-9.-]+")]],
    longitudCtrl: ['', [Validators.required, Validators.pattern("[0-9.-]+")]],
    inicioFechaCtrl: ['', Validators.required],
    finFechaCtrl: ['', Validators.required],
    parametroCtrl: [0, Validators.required],
    unidadCtrl: [0, Validators.required],
    valorCtrl: ['', Validators.required],
    metodologiaMuestreoCtrl: ['', Validators.required],
    otraMetodologiaMuestreo: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    frecuenciaMonitoreoCtrl: ['', Validators.required],
    equipoCtrl: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]],
    tipoMonitoreoCtrl: ['', Validators.required],
    valorMaximoCtrl: ['', Validators.required],
    observacionesCtrl: ['', Validators.pattern("[a-zA-Z0-9\\s.()&/áéíóúÁÉÍÓÚñÑüÜ-]+")]
  });


  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  setValueForm(name: string, direccion: string, departamento: string): void {
    this.firstFormGroup.controls['nombrePlantCtrl'].setValue(name);
    this.firstFormGroup.controls['direccionPlantCtrl'].setValue(direccion);
    this.firstFormGroup.controls['departamentoPlantCtrl'].setValue(departamento);
  }

  onContinue(stepper: MatStepper) {
    this.alertService.clear();
    if (!this.validateCompanyContinue(stepper)) {
      this.setValueForm('', '', '')
    }
  }

  showPlantInfo(stepper: MatStepper): void {
    this.alertService.clear();
    if (this.validateCompany(stepper)) {
      let nroEnlace = this.firstFormGroup.value.nroEnlaceCtrl || '';
      if (nroEnlace != '') {
        this.getPlantAndSetValue(nroEnlace);
      }
    } else {
      this.setValueForm('', '', '');
    }
  }

  private getPlantAndSetValue(nroEnlace: string): void {
    this.plantService.getPlant(nroEnlace).subscribe({
      next: (resp) => {
        this.idPlant = resp.plant.id;
        let nombre = resp.plant.nombre;
        let direccion = resp.plant.direccion;
        let departamento = resp.plant.departamento;
        this.setValueForm(nombre, direccion, departamento);
      },
      error: err => {
        this.alertService.clear();
        if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          this.router.navigate(['login']);
        } else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
        else this.alertService.error("Error obteniendo datos de la planta");
      }
    })
  }

  validateExistNameCompany(): boolean {
    return this.nameCompanys.filter((e: any) => e.nombre === this.firstFormGroup.value.nombreCtrl).length > 0;
  }

  validateExistNroEnlace(): boolean {
    return this.nroEnlaces.filter((e: any) => e === this.firstFormGroup.value.nroEnlaceCtrl).length > 0;
  }

  onFinish(stepper: MatStepper) {
    this.alertService.clear();
    let form = this.secondFormGroup.value;
    let metodologia = form.metodologiaMuestreoCtrl == 'Otro' ? form.otraMetodologiaMuestreo : form.metodologiaMuestreoCtrl;
    if (this.validateDataAire()) {
      let aireReport = new Aire(
        form.nombrePunto!,
        form.latitudCtrl!,
        form.longitudCtrl!,
        form.inicioFechaCtrl!,
        form.finFechaCtrl!,
        form.parametroCtrl!,
        form.unidadCtrl!,
        Number(form.valorCtrl),
        metodologia!,
        form.frecuenciaMonitoreoCtrl!,
        form.equipoCtrl!,
        form.tipoMonitoreoCtrl!.toUpperCase(),
        Number(form.valorMaximoCtrl),
        form.observacionesCtrl!,
        0,
        this.idPlant
      )
      this.addAireReport(aireReport, stepper);
    }
  }

  addAireReport(aireReport: Aire, stepper: MatStepper): void {
    this.aireService.addAire(aireReport).subscribe({
      next: res => {
        this.alertService.success(res.message, this.options);
        setTimeout(() => {
          stepper.reset();
          window.location.reload();
        }, 800);
      },
      error: err => {
        if (err.status == 409) {
          this.alertService.warn(err.error.message, this.options);
          setTimeout(() => {
            stepper.reset();
            window.location.reload();
          }, 2400);
        }
        else if (err.status == 0) {
          this.alertService.error("Servicio sin conexión", this.options);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1400);
        } else if (err.status == 400) {
          this.alertService.error(err.error.message, this.options);
        }
        else if (err.status == 500) this.alertService.error(err.error.message, this.options);
      }
    })
  }

  validateCompanyContinue(stepper: MatStepper): boolean {
    if (this.firstFormGroup.value.nombreCtrl == "" || !this.firstFormGroup.value.nombreCtrl) {
      this.alertService.error("Debe ingresar un nombre de empresa", this.options);
      return false;
    }
    else if (this.firstFormGroup.value.nroEnlaceCtrl == "" || !this.firstFormGroup.value.nroEnlaceCtrl) {
      this.alertService.error("Debe ingresar una número de enlace", this.options);
      return false;
    }
    else if (!this.validateExistNameCompany()) {
      stepper.selectedIndex = 0;
      this.firstFormGroup.controls['nombreCtrl'].setValue(null);
      this.alertService.error("La empresa no existe seleccione una existente", this.options);
      return false;
    }
    else if (!this.validateExistNroEnlace()) {
      stepper.selectedIndex = 0;
      this.firstFormGroup.controls['nroEnlaceCtrl'].setValue(null);
      this.alertService.error("Número de enlace no existe para esta empresa, se debe agregar planta", this.options);
      return false;
    }
    return true;
  }

  validateCompany(stepper: MatStepper): boolean {
    if (this.firstFormGroup.value.nombreCtrl == "" || !this.firstFormGroup.value.nombreCtrl) {
      this.alertService.error("Debe ingresar un nombre de empresa", this.options);
      return false;
    }
    else if (!this.validateExistNameCompany()) {
      stepper.selectedIndex = 0;
      this.firstFormGroup.controls['nombreCtrl'].setValue(null);
      this.alertService.error("La empresa no existe seleccione una existente", this.options);
      return false;
    }
    return true;
  }

  comboValor(event: any): void {
    if (event.checked) {
      this.secondFormGroup.controls['valorMaximoCtrl'].disable();
    }
    else {
      this.secondFormGroup.controls['valorMaximoCtrl'].enable();
    }
  }

  showError(controlName: string, errorMessage: string): boolean {
    this.alertService.error(errorMessage, this.options);
    const control = this.secondFormGroup.controls[controlName as keyof typeof this.secondFormGroup.controls];
    if (control) {
      control.markAsTouched();
    }
    return false;
  }

  validateDataAire(): boolean {
    let dayNow = new Date(Date.now()).getDate();
    let dateSelected = this.secondFormGroup.value.finFechaCtrl?.toString().split(' ') || '';
    let daySelected = parseInt(dateSelected[2]);
    const form = this.secondFormGroup.value;
    if (!form.nombrePunto) {
      return this.showError("nombrePunto", "Debe ingresar un nombre al punto");
    }
    else if (!form.latitudCtrl) {
      return this.showError("latitudCtrl", "Debe ingresar una latitud");
    }
    else if (this.secondFormGroup.controls['latitudCtrl'].hasError('pattern')) {
      return this.showError("latitudCtrl", "Debe ingresar una latitud válida");
    }
    else if (!form.longitudCtrl) {
      return this.showError("longitudCtrl", "Debe ingresar una longitud");
    }
    else if (this.secondFormGroup.controls['longitudCtrl'].hasError('pattern')) {
      return this.showError("longitudCtrl", "Debe ingresar una longitud válida");
    }
    else if (!form.inicioFechaCtrl) {
      return this.showError("inicioFechaCtrl", "Debe ingresar una fecha de inicio");
    }
    else if (!form.finFechaCtrl) {
      return this.showError("finFechaCtrl", "Debe ingresar una fecha de fin");
    }
    else if (daySelected > dayNow) {
      this.alertService.error("Debe ingresar una fecha de fin menor o igual al día de hoy", this.options);
      this.secondFormGroup.controls['finFechaCtrl'].setValue('');
      return false;
    }
    else if (!form.parametroCtrl) {
      return this.showError("parametroCtrl", "Debe ingresar un parametro");
    }
    else if (!form.unidadCtrl) {
      return this.showError("unidadCtrl", "Debe ingresar una unidad");
    }
    else if (!form.valorCtrl) {
      return this.showError("valorCtrl", "Debe ingresar un valor");
    }
    else if (Number(form.valorCtrl?.valueOf()) <= 0) {
      this.alertService.error("Debe ingresar un valor mayor a 0", this.options);
      this.secondFormGroup.controls['valorCtrl'].setValue(null);
      return false;
    }
    else if (!form.metodologiaMuestreoCtrl) {
      return this.showError("metodologiaMuestreoCtrl", "Debe ingresar una metodología de muestreo/análisis");
    }
    else if (!form.frecuenciaMonitoreoCtrl) {
      return this.showError("frecuenciaMonitoreoCtrl", "Debe ingresar una frecuencia de monitoreo");
    }
    else if (!form.equipoCtrl) {
      return this.showError("equipoCtrl", "Debe ingresar el equipo utilizado");
    }
    else if (this.secondFormGroup.controls['equipoCtrl'].hasError('pattern')) {
      this.alertService.error("Debe ingresar una equipo válido", this.options);
      this.secondFormGroup.controls['equipoCtrl'].markAsTouched();
      return false;
    }
    else if (!form.tipoMonitoreoCtrl) {
      return this.showError("tipoMonitoreoCtrl", "Debe ingresar el tipo de monitoreo");
    }
    else if (form.valorMaximoCtrl == '') {
      return this.showError("valorMaximoCtrl", "Debe ingresar el valor máximo");
    }
    else if (Number(form.valorMaximoCtrl?.valueOf()) <= 0) {
      this.alertService.error("Debe ingresar un valor máximo mayor a 0", this.options);
      this.secondFormGroup.controls['valorMaximoCtrl'].setValue(null);
      return false;
    }
    else if (this.secondFormGroup.controls['observacionesCtrl'].hasError('pattern')) {
      return this.showError("observacionesCtrl", "Debe ingresar una observación válida");
    }
    else if (form.metodologiaMuestreoCtrl == "Otro") {
      let bannedWords = ["otro", "otros", "otr", "no aplica", "sd"];
      if (form.otraMetodologiaMuestreo == "") {
        return this.showError("otraMetodologiaMuestreo", "Debe ingresar un detalle en metodología de muestreo/análisis");
      }
      else if (this.secondFormGroup.controls['otraMetodologiaMuestreo'].hasError('pattern')) {
        return this.showError("otraMetodologiaMuestreo", "Debe ingresar un detalle en metodología de muestreo/análisis válido");
      }
      else if (bannedWords.some(word => form.otraMetodologiaMuestreo!.toLowerCase().includes(word))) {
        return this.showError("otraMetodologiaMuestreo", "Debe ingresar un DETALLE REAL en metodología de muestreo/análisis");
      }
    }
    return true
  }

}
