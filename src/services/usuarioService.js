import { createCrudService } from './crudService';

const api = createCrudService('usuario');

export const obtenerUsuarios = api.obtener;
export const crearUsuario = api.crear;
export const actualizarUsuario = api.actualizar;
export const eliminarUsuario = api.eliminar;
