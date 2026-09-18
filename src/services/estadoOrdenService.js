const API_URL = 'https://6aa6bbd7d7765db985079011.mockapi.io/estado_orden';

export const obtenerEstadosOrden = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

export const crearEstadoOrden = (estado) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(estado)
  }).then((response) => response.json());
};

export const actualizarEstadoOrden = (id, estado) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(estado)
  }).then((response) => response.json());
};

export const eliminarEstadoOrden = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};