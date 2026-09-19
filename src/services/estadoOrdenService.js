import { createCrudService } from './crudService';

const api = createCrudService('estado_orden');

export const obtenerEstadosOrden = api.obtener;
export const crearEstadoOrden = api.crear;
export const actualizarEstadoOrden = api.actualizar;
export const eliminarEstadoOrden = api.eliminar;
