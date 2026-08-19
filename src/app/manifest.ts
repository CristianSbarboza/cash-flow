import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cash Flow — Gestão Financeira Pessoal",
    short_name: "Cash Flow",
    description:
      "Controle sua liquidez, planeje o mês e carimbe seu dinheiro por objetivo.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#059669",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
