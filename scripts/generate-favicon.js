/**
 * Script para gerar favicon.png a partir do favicon.svg
 * 
 * Para usar este script, instale as dependências:
 * npm install --save-dev sharp
 * 
 * Depois execute:
 * node scripts/generate-favicon.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

try {
  // Tentar importar sharp
  const sharp = (await import('sharp')).default;
  
  const svgPath = join(rootDir, 'public', 'favicon.svg');
  const pngPath = join(rootDir, 'public', 'favicon.png');
  
  const svgBuffer = readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(pngPath);
  
  console.log('✅ Favicon PNG gerado com sucesso em:', pngPath);
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('⚠️  Biblioteca "sharp" não encontrada.');
    console.log('📦 Para gerar o favicon.png, instale sharp:');
    console.log('   npm install --save-dev sharp');
    console.log('');
    console.log('💡 Alternativamente, você pode:');
    console.log('   1. Usar o favicon.svg diretamente (suportado por navegadores modernos)');
    console.log('   2. Converter manualmente em: https://convertio.co/svg-png/');
    console.log('   3. Usar ImageMagick: convert -background none favicon.svg -resize 64x64 favicon.png');
  } else {
    console.error('❌ Erro ao gerar favicon:', error.message);
  }
  process.exit(1);
}
