// server.js - Servidor Express mínimo y confiable
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Para SPA - todas las rutas van al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor en 0.0.0.0 (IMPORTANTE para Docker)
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
  console.log(`✅ Accessible from outside the container`);
});