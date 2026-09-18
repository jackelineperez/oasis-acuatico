import { GestionClientes } from '../components/cliente/gestionClientes';

export function ClientePage({ clientes, onActualizarClientes, cargando }) {
  return (
    <GestionClientes
      clientes={clientes}
      onActualizarClientes={onActualizarClientes}
      cargando={cargando}
    />
  );
}