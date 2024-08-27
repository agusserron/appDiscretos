export class InstitucionAgua{
    constructor( 
        public nombre: string,
        public estado: string
        ){}
}

export class InstitucionAguaEdit{
    constructor( 
        public id_institucion : number,
        public nombre: string,
        public estado: string
        ){}
}
