const API_URL = 'https://6aa6bbd7d7765db985079011.mockapi.io/categoria';

export const obtenerCategorias = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

export const crearCategoria = (categoria) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoria)
  }).then((response) => response.json());
};

export const actualizarCategoria = (id, categoria) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoria)
  }).then((response) => response.json());
};

export const eliminarCategoria = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};

