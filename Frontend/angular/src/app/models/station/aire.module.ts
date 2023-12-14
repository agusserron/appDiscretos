  export class Station{
    constructor( 
        public codigo: string,
        public identificacion: string,
        public latitud: string,
        public longitud: string,
        public parametros : number [],
        public idDepartamento : number,
        public idPropietario: number,
        public idOperador: number,
        public estado: boolean,
        public periodos: number []
        ){}
}




