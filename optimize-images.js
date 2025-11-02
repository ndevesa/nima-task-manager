// optimize-images.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./src/assets"; // carpeta de entrada
const outputDir = "./src/assets"; // puede ser otra si querés mantener originales

// Crear outputDir si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (file) => {
  const inputPath = path.join(inputDir, file);
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  const outputPath = path.join(outputDir, `${name}-opt.webp`);

  try {
    await sharp(inputPath)
      .resize(1920) // ajusta ancho máximo
      .webp({ quality: 75 }) // calidad media-alta
      .toFile(outputPath);
    console.log(`✅ Optimizado: ${file} → ${outputPath}`);
  } catch (err) {
    console.error(`❌ Error optimizando ${file}:`, err);
  }
};

// Procesar todos los archivos del directorio
fs.readdirSync(inputDir).forEach((file) => {
  if (/\.(jpg|jpeg|png)$/i.test(file)) {
    optimizeImage(file);
  }
});
