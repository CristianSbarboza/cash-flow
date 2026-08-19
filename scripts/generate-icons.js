/**
 * Gera os ícones do PWA (manifest + apple-touch-icon) a partir da marca
 * "Fluxo" (quadrado esmeralda + onda de fluxo), sem depender de libs de
 * imagem — desenha em memória e codifica PNG usando apenas `zlib`.
 *
 * Uso: node scripts/generate-icons.js
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PRIMARY = [5, 150, 105]; // #059669
const WHITE = [255, 255, 255];
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

// ---------------------------------------------------------------- PNG encode
let crcTable;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // sem filtro
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------- Drawing
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mix(colorA, colorB, t) {
  return [
    lerp(colorA[0], colorB[0], t),
    lerp(colorA[1], colorB[1], t),
    lerp(colorA[2], colorB[2], t),
  ];
}

function roundedRectCoverage(px, py, size, radius) {
  const dx = Math.max(radius - px, px - (size - radius), 0);
  const dy = Math.max(radius - py, py - (size - radius), 0);
  if (px >= radius && px <= size - radius) return 1;
  if (py >= radius && py <= size - radius) return 1;
  return Math.hypot(dx, dy) <= radius ? 1 : 0;
}

/**
 * Desenha o ícone numa resolução `size`, com supersampling 4x para
 * antialiasing. `bleed` = true gera versão de sangria total (maskable /
 * apple-touch-icon), sem cantos arredondados — o SO aplica sua própria máscara.
 */
function drawIcon(size, { bleed, waveScale }) {
  const SS = 4;
  const big = size * SS;
  const radius = bleed ? 0 : big * 0.22;
  const rgba = Buffer.alloc(big * big * 4);

  for (let y = 0; y < big; y++) {
    for (let x = 0; x < big; x++) {
      const i = (y * big + x) * 4;
      const inBg = bleed ? 1 : roundedRectCoverage(x, y, big, radius);
      let color = PRIMARY;
      let alpha = inBg;

      if (inBg) {
        // Coordenadas normalizadas centradas em [-1, 1]
        const nx = (x / big - 0.5) * 2;
        const ny = (y / big - 0.5) * 2;
        const span = waveScale; // largura ocupada pela onda

        if (Math.abs(nx) <= span) {
          const t = (nx / span) * Math.PI * 1.5;
          const wave1 = Math.sin(t) * 0.16;
          const wave2 = Math.sin(t - 0.9) * 0.16 - 0.13;
          const thickness = 0.045;

          const d1 = Math.abs(ny - wave1);
          const d2 = Math.abs(ny - wave2);

          if (d2 < thickness) {
            const cov = 1 - Math.min(d2 / thickness, 1);
            color = mix(color, WHITE, cov * 0.55);
          }
          if (d1 < thickness) {
            const cov = 1 - Math.min(d1 / thickness, 1);
            color = mix(color, WHITE, cov);
          }
        }
      }

      rgba[i] = Math.round(color[0]);
      rgba[i + 1] = Math.round(color[1]);
      rgba[i + 2] = Math.round(color[2]);
      rgba[i + 3] = Math.round(alpha * 255);
    }
  }

  // Downsample SSxSS -> 1px (box filter)
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const si = ((y * SS + sy) * big + (x * SS + sx)) * 4;
          r += rgba[si];
          g += rgba[si + 1];
          b += rgba[si + 2];
          a += rgba[si + 3];
        }
      }
      const n = SS * SS;
      const oi = (y * size + x) * 4;
      out[oi] = Math.round(r / n);
      out[oi + 1] = Math.round(g / n);
      out[oi + 2] = Math.round(b / n);
      out[oi + 3] = Math.round(a / n);
    }
  }
  return out;
}

function writeIcon(name, size, opts) {
  const rgba = drawIcon(size, opts);
  const png = encodePNG(size, size, rgba);
  fs.writeFileSync(path.join(OUT_DIR, name), png);
  console.log(`✓ ${name} (${size}x${size})`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

writeIcon("icon-192.png", 192, { bleed: false, waveScale: 0.72 });
writeIcon("icon-512.png", 512, { bleed: false, waveScale: 0.72 });
writeIcon("icon-512-maskable.png", 512, { bleed: true, waveScale: 0.42 });
writeIcon("apple-touch-icon.png", 180, { bleed: true, waveScale: 0.5 });

console.log("Ícones gerados em public/icons/");
