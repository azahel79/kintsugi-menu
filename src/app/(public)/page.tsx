import { Portada } from '@/components/menu/Portada';
import { getMenu } from '@/lib/menu';

export default async function Bienvenida() {
  const menu = await getMenu();
  const n = menu.negocio;
  return (
    <Portada
      portada={n.portada}
      lema={n.lema}
      titulo={n.bienvenidaTitulo}
      texto={n.bienvenidaTexto}
      horario={n.horario}
      zona={n.zona}
      primeraSeccion={menu.secciones[0]?.id ?? 'ramen-sushi'}
    />
  );
}
