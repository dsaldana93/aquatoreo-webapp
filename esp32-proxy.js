import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Habilitar CORS para todas las rutas
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Proxy hacia el ESP32
app.use('/', createProxyMiddleware({
    target: 'http://192.168.100.68',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/',
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'No se puede conectar al ESP32' });
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxy request: ${req.method} ${req.url} -> http://192.168.100.68${req.url}`);
    }
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proxy ESP32 ejecutándose en http://localhost:${PORT}`);
    console.log(`🌐 Accesible desde la red en http://192.168.100.81:${PORT}`);
    console.log(`📡 Conecta tu aplicación remota a: http://192.168.100.81:${PORT}`);
});