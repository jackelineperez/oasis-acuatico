import { createCrudService } from './crudService';

const api = createCrudService('producto');

export const obtenerProductos = api.obtener;
export const crearProducto = api.crear;
export const actualizarProducto = api.actualizar;
export const eliminarProducto = api.eliminar;
