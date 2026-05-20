export interface IProducto {
    id: string, 
    nombre: string,
    descripcion: string,
    tiempo_elaboracion: number,
    precio: number,
    tipo: TipoProducto,
    fotos: string[],
}

export enum TipoProducto {
    Plato = "plato",
    Bebida = "bebida"
}


