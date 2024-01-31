  export class Plant{
    constructor( 
        public id: number,
        public nombre: string,
        public nroEnlace: string
        ){}
}

export class PlantToAdd{
  constructor( 
      public nombre: string,
      public nroEnlace: string,
      public direccion: string,
      public idDepartamento: number,
      public idEmpresa: number,
      ){}
}

export class IPlant{
  constructor( 
      public nombre: string,
      public nroEnlace: string,
      public direccion: string,
      public departamento: string,
      public nombreEmpresa: string,
      ){}
}



