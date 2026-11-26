import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Solo imágenes propias: las del repo (/img) y las subidas desde el panel (/media).
    localPatterns: [
      { pathname: "/img/**", search: "" },
      { pathname: "/media/**", search: "" },
    ],
    // WebP: se genera rápido la primera vez (AVIF tarda mucho más en el primer acceso).
    formats: ["image/webp"],
    qualities: [75, 85],
    // Las imágenes optimizadas se guardan 31 días (cada foto nueva del panel tiene otra URL).
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // Las fotos se reducen en el navegador antes de subirse; 4 MB deja margen.
    serverActions: { bodySizeLimit: "4mb" },
    // En este equipo la caché en disco de Turbopack dejaba CSS viejo (cambios de
    // globals.css que no aparecían ni reiniciando). Se desactiva solo en desarrollo.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
