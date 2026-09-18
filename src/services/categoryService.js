const API_URL = 'https://6aa6bbd7d7765db985079011.mockapi.io/categoria';

export const obtenerCategorias = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};
