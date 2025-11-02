import axios from 'axios';

// Configuración dinámica basada en el entorno
const getESP32BaseURL = () => {
    // Si estamos en desarrollo local, usa proxy
    if (import.meta.env.DEV) {
        return '/api/';
    }
    
    // Si estamos en el servidor pero accediendo desde red local, usa IP local
    if (window.location.hostname === '192.168.100.81' || 
        window.location.hostname.startsWith('192.168.')) {
        return 'http://192.168.100.68/';
    }
    
    // Si estamos en el servidor remoto, permitir configuración manual
    const storedIP = localStorage.getItem('esp32_ip');
    if (storedIP) {
        return `http://${storedIP}/`;
    }
    
    // Default para servidor remoto - requerirá configuración manual
    return 'http://192.168.100.68/';
};

const ESP32_BASE_URL = getESP32BaseURL();

const api = axios.create({
    baseURL: ESP32_BASE_URL,
    timeout: 10000, // Aumentamos timeout
});

export const checkConnection = async () => {
    try {
        console.log('Intentando conectar al ESP32 en:', ESP32_BASE_URL);
        // Intentamos obtener la página principal para verificar conexión
        const response = await api.get('/');
        console.log('Respuesta del ESP32:', response.status);
        return { 
            connected: true, 
            ip: getActualIP()
        };
    } catch (error) {
        console.error('Error conectando al ESP32:', error.message);
        throw new Error('No se pudo conectar al ESP32');
    }
};

// Función auxiliar para obtener la IP real del ESP32
const getActualIP = () => {
    if (import.meta.env.DEV) {
        return '192.168.100.68';
    }
    
    const storedIP = localStorage.getItem('esp32_ip');
    if (storedIP) {
        return storedIP;
    }
    
    return '192.168.100.68';
};

// Función para configurar IP manualmente desde la interfaz
export const setESP32IP = (ip) => {
    localStorage.setItem('esp32_ip', ip);
    // Actualizar la configuración de axios
    api.defaults.baseURL = `http://${ip}/`;
    return true;
};

// Función para obtener la IP configurada
export const getESP32IP = () => {
    return getActualIP();
};

export const getCountdown = async () => {
    const response = await api.get('/countdown');
    return response.data;
};

export const startCountdown = async (minutes, seconds) => {
    const response = await api.get(`/start?min=${minutes}&sec=${seconds}`);
    return response.data;
};

export const stopCountdown = async () => {
    const response = await api.get('/off');
    return response.data;
};

export default api;