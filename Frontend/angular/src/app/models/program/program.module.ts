  export class Program{
    constructor( 
        public id: number,
        public nombre: string,
        public codigo : string,
        public visible : number,
        public version : number,
        public idSilad : number     
        ){}
}

export class Station {
constructor(
  public estacion: string,
  public descripcion: string,
  public latitud : number,
  public longitud : number,
  public id_programa : number,  
  public id_estacion : number,
){}

}




