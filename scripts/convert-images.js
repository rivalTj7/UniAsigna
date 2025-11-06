/**
 * Script para convertir imágenes JPEG a WebP
 * Requiere: npm install sharp
 * Uso: node scripts/convert-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const imagesToConvert = [
  'escudo-usac.jpeg',
  'logo-laboratorio.jpeg',
  'logo-usac.jpeg'
];

async function convertToWebP() {
  console.log('🖼️  Iniciando conversión de imágenes a WebP...\n');

  for (const imageName of imagesToConvert) {
    const inputPath = path.join(publicDir, imageName);
    const outputPath = path.join(publicDir, imageName.replace('.jpeg', '.webp'));

    try {
      // Verificar si el archivo existe
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Archivo no encontrado: ${imageName}`);
        continue;
      }

      // Convertir a WebP
      await sharp(inputPath)
        .webp({ quality: 90, effort: 6 })
        .toFile(outputPath);

      // Obtener tamaños de archivo
      const originalSize = fs.statSync(inputPath).size;
      const webpSize = fs.statSync(outputPath).size;
      const reduction = ((1 - webpSize / originalSize) * 100).toFixed(2);

      console.log(`✅ ${imageName}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   WebP: ${(webpSize / 1024).toFixed(2)} KB`);
      console.log(`   Reducción: ${reduction}%\n`);
    } catch (error) {
      console.error(`❌ Error convirtiendo ${imageName}:`, error.message);
    }
  }

  console.log('✨ Conversión completada!');
  console.log('\n📝 Nota: Las imágenes originales se mantienen intactas.');
  console.log('   Next.js automáticamente servirá WebP cuando sea compatible.');
}

convertToWebP().catch(console.error);
