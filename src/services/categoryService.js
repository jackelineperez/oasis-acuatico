import { createCrudService } from './crudService';

const api = createCrudService('categoria');

export const obtenerCategorias = api.obtener;
export const crearCategoria = api.crear;
export const actualizarCategoria = api.actualizar;
export const eliminarCategoria = api.eliminar;
