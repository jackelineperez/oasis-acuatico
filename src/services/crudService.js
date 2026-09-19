const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://6aa6bbd7d7765db985079011.mockapi.io';

// Lanza un Error si la respuesta HTTP no es 2xx; devuelve el JSON si lo hay.
const manejarRespuesta = async (response) => {
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} (${response.url})`);
  }
  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
};

const jsonRequest = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

// Crea las 4 operaciones CRUD para un recurso de la API.
export const createCrudService = (recurso) => {
  const url = `${API_BASE_URL}/${recurso}`;
  return {
    obtener: () => fetch(url).then(manejarRespuesta),
    crear: (datos) => fetch(url, jsonRequest('POST', datos)).then(manejarRespuesta),
    actualizar: (id, datos) => fetch(`${url}/${id}`, jsonRequest('PUT', datos)).then(manejarRespuesta),
    eliminar: (id) => fetch(`${url}/${id}`, { method: 'DELETE' }).then(manejarRespuesta)
  };
};
