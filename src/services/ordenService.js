const API_URL = 'https://6aa6bbd7d7765db985079011.mockapi.io/orden';

export const obtenerOrdenes = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

export const crearOrden = (orden) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orden)
  }).then((response) => response.json());
};

export const actualizarOrden = (id, orden) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orden)
  }).then((response) => response.json());
};

export const eliminarOrden = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};