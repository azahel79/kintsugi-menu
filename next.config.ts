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
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
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
