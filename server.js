// server.js - Versión ES modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Para SPA - todas las rutas van al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor en 0.0.0.0 (CRÍTICO para Docker)
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor Express ejecutándose en http://0.0.0.0:${port}`);
  console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'dist')}`);
  console.log(`✅ Aplicación lista y accesible desde el exterior`);
});