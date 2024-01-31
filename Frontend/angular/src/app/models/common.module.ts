export interface GenericInterface<T> {
    value: T;
    viewValue: T;
}

export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    externalUrl?: string,
    external: boolean,
    roles: string[],
    children?: NavItem[];
}

export type Parametro = GenericInterface<string>;
export type Unidad = GenericInterface<string>;
export type Frecuencia = GenericInterface<string>;
export type Departamento = GenericInterface<string>;
export type Metodologia = GenericInterface<string>;
export type Estado = GenericInterface<string>;

export const parametros: Parametro[] = [
    { value: '1', viewValue: 'PM10' },
    { value: '2', viewValue: 'PM2.5' },
    { value: '3', viewValue: 'SO₂' },
    { value: '4', viewValue: 'NO₂' },
    { value: '5', viewValue: 'O₃' },
    { value: '6', viewValue: 'Pb' },
    { value: '7', viewValue: 'TRS' },
    { value: '8', viewValue: 'NOX' },
    { value: '9', viewValue: 'CO' },
    { value: '10', viewValue: 'Cr (Cromo total)' },
    { value: '11', viewValue: 'Cr VI' },
    { value: '12', viewValue: 'Hg' },
    { value: '13', viewValue: 'COVs' },
    { value: '14', viewValue: 'PTS' },
];

export const departamentos: Departamento[] = [
    { value: '1', viewValue: 'Artigas' },
    { value: '2', viewValue: 'Canelones' },
    { value: '3', viewValue: 'Cerro Largo' },
    { value: '4', viewValue: 'Colonia' },
    { value: '5', viewValue: 'Durazno' },
    { value: '6', viewValue: 'Flores' },
    { value: '7', viewValue: 'Florida' },
    { value: '8', viewValue: 'Lavalleja' },
    { value: '9', viewValue: 'Maldonado' },
    { value: '10', viewValue: 'Montevideo' },
    { value: '11', viewValue: 'Paysandú' },
    { value: '12', viewValue: 'Río Negro' },
    { value: '13', viewValue: 'Rivera' },
    { value: '14', viewValue: 'Rocha' },
    { value: '15', viewValue: 'Salto' },
    { value: '16', viewValue: 'San José' },
    { value: '17', viewValue: 'Soriano' },
    { value: '18', viewValue: 'Tacuarembó' },
    { value: '19', viewValue: 'Treinta y Tres' },
];

export const unidades: Unidad[] = [
    { value: '1', viewValue: 'µg/m3' }
];

export const frecuencias: Frecuencia[] = [
    { value: '1', viewValue: '15m' },
    { value: '2', viewValue: '30m' },
    { value: '3', viewValue: '1h' },
    { value: '4', viewValue: '8h' },
    { value: '5', viewValue: '24hs' },
    { value: '6', viewValue: '1 mes' },
    { value: '7', viewValue: '1 año' },
];

export const metodologias: Metodologia[] = [
    { value: '1', viewValue: 'CFR 40 Appendix C to Part 50' },
    { value: '2', viewValue: 'Quimioluminiscencia CFR 40 Appendix F to Part 50' },
    { value: '3', viewValue: 'CFR 40 Appendix D to part 50' },
    { value: '4', viewValue: 'CFR 40 Appendix A -1 to Part 50' },
    { value: '5', viewValue: 'CFR 40 Appendix A-2 to Part 50' },
    { value: '6', viewValue: 'CFR 40 Appendix L to Part 50' },
    { value: '7', viewValue: 'CFR 40 Appendix J to Part 50' },
    { value: '8', viewValue: 'CFR 40 Appendix Q to Part 50' },
    { value: '9', viewValue: 'Method IO - 3.1' },
    { value: '10', viewValue: 'Method IO-3.2' },
    { value: '11', viewValue: 'Method IO-3.4 Method IO-3.5' },
    { value: '12', viewValue: 'Procedimiento 3260UY/3146UY (DINACEA)' },
    { value: '13', viewValue: 'Otro' }
];

export const tiposMonitoreos: Frecuencia[] = [
    { value: '1', viewValue: 'Discreto' },
    { value: '2', viewValue: 'Continuo' }
];

export const parametrosEstaciones: string[] = [
    'PM10',
    'PTS'
];

export const estados: Estado[] = [
    { value: '1', viewValue: 'Activa' },
    { value: '2', viewValue: 'Inactiva' },
]

export const periodsList: string[] = [
    'Anual',
    '24 Horas',
    '15 Minutos',
    '1 Hora',
    '8 Horas',
    '3 Meses'
];

export const propietarios: string[] = [
    'CURE',
    'DINACEA',
    'DINARA',
    'LATU',
    'MGAP',
    'Montes del Plata',
    'OSE',
    'UTE',
    'Intendencia de Artigas',
    'Intendencia de Canelones',
    'Intendencia de Cerro Largo',
    'Intendencia de Colonia',
    'Intendencia de Durazno',
    'Intendencia de Flores',
    'Intendencia de Florida',
    'Intendencia de Lavalleja',
    'Intendencia de Maldonado',
    'Intendencia de Montevideo',
    'Intendencia de Paysandú',
    'Intendencia de Río Negro',
    'Intendencia de Rivera',
    'Intendencia de Rocha',
    'Intendencia de Salto',
    'Intendencia de San José',
    'Intendencia de Soriano',
    'Intendencia de Tacuarembó',
    'Intendencia de Treinta y Tres'
]

export const operadores: string[] = [
    'CURE',
    'DINACEA',
    'DINARA',
    'LATU',
    'MGAP',
    'Montes del Plata',
    'OSE',
    'UTE',
    'Intendencia de Artigas',
    'Intendencia de Canelones',
    'Intendencia de Cerro Largo',
    'Intendencia de Colonia',
    'Intendencia de Durazno',
    'Intendencia de Flores',
    'Intendencia de Florida',
    'Intendencia de Lavalleja',
    'Intendencia de Maldonado',
    'Intendencia de Montevideo',
    'Intendencia de Paysandú',
    'Intendencia de Río Negro',
    'Intendencia de Rivera',
    'Intendencia de Rocha',
    'Intendencia de Salto',
    'Intendencia de San José',
    'Intendencia de Soriano',
    'Intendencia de Tacuarembó',
    'Intendencia de Treinta y Tres'
]