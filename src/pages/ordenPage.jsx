import { GestionOrdenes } from '../components/orden/gestionOrdenes';

export function OrdenPage({ ordenes, onActualizarOrdenes, cargando }) {
  return (
    <GestionOrdenes
      ordenes={ordenes}
      onActualizarOrdenes={onActualizarOrdenes}
      cargando={cargando}
    />
  );
}