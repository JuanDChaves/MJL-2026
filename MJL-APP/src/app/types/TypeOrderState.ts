export enum TypeOrderState {
    Pendiente = 'pendiente',
    Preparando = 'preparando',
    Hecho = 'hecho',
    Entregado = 'entregado',
    Recibido = 'recibido',   // <-- NUEVO: El Cliente lo pasa a este estado
    Editando = 'editando',
    Pagado = 'pagado',
    Finalizado = 'finalizado'
} 