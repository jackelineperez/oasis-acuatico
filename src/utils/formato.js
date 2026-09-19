// Formatea un precio numérico (o texto heredado como "$18.500") para mostrarlo.
export const formatearPrecio = (precio) => {
  if (typeof precio === 'number') return `$ ${precio.toLocaleString('es-CO')}`;
  const texto = String(precio ?? '');
  return texto.startsWith('$') ? texto : `$ ${texto}`;
};
