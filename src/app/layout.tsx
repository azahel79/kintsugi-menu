import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/anim/MotionProvider";
import "./globals.css";

// Fuentes latinas guardadas en el proyecto: el build no depende de internet.
const marker = localFont({ src: "../fonts/permanent-marker-400.woff2", variable: "--font-marker", weight: "400", display: "swap" });
const arvo = localFont({
  src: [
    { path: "../fonts/arvo-400.woff2", weight: "400" },
    { path: "../fonts/arvo-700.woff2", weight: "700" },
  ],
  variable: "--font-arvo",
  display: "swap",
});
// Caveat solo se usa en precios: recortada a cifras y signos (~3 KB).
const caveat = localFont({ src: "../fonts/caveat-700-precios.woff2", variable: "--font-caveat", weight: "700", display: "swap" });
const jakarta = localFont({ src: "../fonts/jakarta-400-700.woff2", variable: "--font-jakarta", weight: "400 700", display: "swap" });

// Pincel japonés (Yuji Syuku) recortado a los caracteres que usa el diseño: ~14 KB.
// El texto japonés normal usa las fuentes del sistema (iPhone, Android y Windows ya las traen).
const yuji = localFont({ src: "../fonts/yuji-syuku-pincel.woff2", variable: "--font-yuji", weight: "400", display: "swap" });
// Íconos Material Symbols: solo los de src/lib/icons.ts (~10 KB), sin depender de Google.
const iconos = localFont({ src: "../fonts/material-symbols-subset.woff2", variable: "--font-iconos", weight: "400", display: "block", preload: true });

// Dominio público: lo usa WhatsApp/Facebook para encontrar la imagen de vista previa.
// En Vercel se toma solo el dominio de producción; NEXT_PUBLIC_SITE_URL permite fijar uno propio.
const SITIO =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://kintsugi-menu-nu.vercel.app");

const DESCRIPCION = "Ramen artesanal, sushi armado a tu gusto, entradas, bebidas y postres. Mira nuestro menú digital 🍜";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: { default: "Kintsugi Banderilla · Cocina Japonesa", template: "%s · Kintsugi Banderilla" },
  description: DESCRIPCION,
  applicationName: "Kintsugi Banderilla",
  // La imagen sale de src/app/opengraph-image.jpg (convención de archivos de Next).
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Kintsugi Banderilla",
    title: "Kintsugi Banderilla · Cocina Japonesa",
    description: DESCRIPCION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kintsugi Banderilla · Cocina Japonesa",
    description: DESCRIPCION,
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${marker.variable} ${arvo.variable} ${caveat.variable} ${jakarta.variable} ${yuji.variable} ${iconos.variable}`}>
      <body className="bg-dark-surface text-ink-black font-body antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
