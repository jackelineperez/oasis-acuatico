import { createCrudService } from './crudService';

const api = createCrudService('cliente');

export const obtenerClientes = api.obtener;
export const crearCliente = api.crear;
export const actualizarCliente = api.actualizar;
export const eliminarCliente = api.eliminar;
