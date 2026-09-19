import { createCrudService } from './crudService';

const api = createCrudService('orden');

export const obtenerOrdenes = api.obtener;
export const crearOrden = api.crear;
export const actualizarOrden = api.actualizar;
export const eliminarOrden = api.eliminar;
