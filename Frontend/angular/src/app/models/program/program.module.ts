  export class Program{
    constructor( 
        public nombre: string,
        public codigo : string,
        public visible : number,
        public version : number,
        public parametros?: { option: string, color: string, id_parametro: number }[]
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




