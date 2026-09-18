const API_URL = 'https://6aa6bbd7d7765db985079011.mockapi.io/cliente';

export const obtenerClientes = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

export const crearCliente = (cliente) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  }).then((response) => response.json());
};

export const actualizarCliente = (id, cliente) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  }).then((response) => response.json());
};

export const eliminarCliente = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};