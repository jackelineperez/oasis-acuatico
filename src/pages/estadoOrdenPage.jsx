import { GestionEstadosOrden } from '../components/estadoOrden/gestionEstadoOrden';

export function EstadoOrdenPage({ estados, onActualizarEstados, cargando }) {
  return (
    <GestionEstadosOrden
      estados={estados}
      onActualizarEstados={onActualizarEstados}
      cargando={cargando}
    />
  );
}