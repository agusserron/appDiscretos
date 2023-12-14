  export class Company{
    constructor( 
        public id: number,
        public nombre: string,
        public rut: string,
        public direccion: string,
        ){}
}

export class CompanyToAdd{
  constructor( 
      public nombre: string,
      public rut: string,
      public direccion: string
      ){}
}



