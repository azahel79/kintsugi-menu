import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BotonGuardar, FormAccion } from '@/components/admin/Form';
import { AdminShell, Cargando, estilos } from '@/components/admin/Shell';
import { cambiarPassword, guardarNegocio, logout } from '@/lib/actions';
import { adminNegocio } from '@/lib/admin-data';
import { Fondos } from './Fondos';

export const metadata: Metadata = { title: 'Apariencia y negocio', robots: { index: false } };

export default function AjustesPage() {
  return (
    <AdminShell
      subtitulo="Apariencia y negocio"
      nav="ajustes"
      derecha={
        <form action={logout}>
          <button type="submit" className="inline-flex items-center gap-1 px-gutter-md py-gutter-xs rounded-full bg-washi/5 border border-kintsugi-gold/60 text-washi hover:bg-washi/10 font-label text-label-sm shrink-0">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">logout</span>Salir
          </button>
        </form>
      }
    >
      <Suspense fallback={<Cargando filas={5} />}>
        <Contenido />
      </Suspense>
    </AdminShell>
  );
}

const CAMPOS: [keyof Negocio, string, string, string][] = [
  ['nombre', 'Nombre del negocio', 'text', 'Kintsugi Banderilla'],
  ['whatsapp', 'WhatsApp (contacto)', 'tel', '228 123 4567'],
  ['horario', 'Horario de atención', 'text', 'Mar a Dom · 1:00 PM – 10:00 PM'],
  ['direccion', 'Dirección', 'text', 'Centro, Banderilla, Veracruz'],
  ['zona', 'Zona corta (portada)', 'text', 'Centro, Banderilla'],
  ['lema', 'Lema bajo el logo', 'text', 'Cocina Japonesa · Banderilla, Ver.'],
  ['bienvenidaTitulo', 'Título de bienvenida', 'text', '¡Bienvenido a Kintsugi!'],
  ['bienvenidaTexto', 'Mensaje de bienvenida', 'text', ''],
  ['avisoMesero', 'Aviso en cada platillo', 'text', 'Pídelo a tu mesero'],
  ['facebook', 'Facebook (enlace)', 'url', 'https://facebook.com/…'],
  ['instagram', 'Instagram (enlace)', 'url', 'https://instagram.com/…'],
  ['tiktok', 'TikTok (enlace)', 'url', 'https://www.tiktok.com/@…'],
];
type Negocio = NonNullable<Awaited<ReturnType<typeof adminNegocio>>['negocio']>;

async function Contenido() {
  const { negocio, secciones } = await adminNegocio();
  return (
    <>
      <Fondos
        fondos={[
          { destino: 'portada', nombre: 'Portada (bienvenida)', url: negocio.portada, predeterminado: 'ninguno' },
          { destino: 'mascota', nombre: 'Mascota / logo', url: negocio.mascota, predeterminado: 'ninguno' },
          ...secciones.map((s) => ({ destino: `seccion:${s.id}`, nombre: s.nombre, url: s.fondo, predeterminado: 'sumi' as const })),
        ]}
      />

      <section className="flex flex-col gap-gutter-md">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Datos del negocio</h2>
        <FormAccion action={guardarNegocio}>
          <div className="rounded-lg tarjeta-washi border border-kintsugi-gold p-gutter-md flex flex-col gap-gutter-sm">
            {CAMPOS.map(([k, label, tipo, ph]) => (
              <div key={k} className="flex flex-col gap-gutter-xs">
                <label htmlFor={k} className={estilos.label}>{label}</label>
                <input id={k} name={k} type={tipo} defaultValue={String(negocio[k] ?? '')} placeholder={ph} className={estilos.input} />
              </div>
            ))}
          </div>
          <BotonGuardar>Guardar ajustes</BotonGuardar>
        </FormAccion>
      </section>

      <section className="flex flex-col gap-gutter-md">
        <h2 className="self-start inline-flex items-center gap-gutter-sm px-gutter-md py-1 rounded-sm bg-ink-black text-washi shadow-md before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:rounded-[1px] before:bg-primary font-headline text-title-md uppercase">Contraseña del panel</h2>
        <FormAccion action={cambiarPassword}>
          <div className="rounded-lg tarjeta-washi border border-kintsugi-gold p-gutter-md flex flex-col gap-gutter-sm">
            {[
              ['actual', 'Contraseña actual', 'current-password'],
              ['nueva', 'Contraseña nueva (mín. 8)', 'new-password'],
              ['confirmar', 'Repite la nueva', 'new-password'],
            ].map(([n, l, ac]) => (
              <div key={n} className="flex flex-col gap-gutter-xs">
                <label htmlFor={n} className={estilos.label}>{l}</label>
                <input id={n} name={n} type="password" autoComplete={ac} className={estilos.input} />
              </div>
            ))}
          </div>
          <BotonGuardar icono="key">Cambiar contraseña</BotonGuardar>
        </FormAccion>
      </section>
    </>
  );
}
