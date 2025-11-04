import axios from 'axios';

// Configuración para usar el proxy Nginx en todos los entornos
const getESP32BaseURL = () => {
    // En todos los casos usamos el proxy, no conexión directa
    return '/esp32/';
};

const ESP32_BASE_URL = getESP32BaseURL();

const api = axios.create({
    baseURL: ESP32_BASE_URL,
    timeout: 10000,
});

export const checkConnection = async () => {
    try {
        console.log('Verificando conexión con ESP32 a través del proxy:', ESP32_BASE_URL);
        
        // Intentamos obtener la página principal del ESP32 a través del proxy
        const response = await api.get('/');
        console.log('Respuesta del proxy:', response.status);
        
        // Verificamos que sea realmente la página del ESP32
        if (response.data && response.data.includes && 
            (response.data.includes('Control del LED') || response.data.includes('Control LED'))) {
            return { 
                connected: true, 
                ip: 'Conectado vía proxy',
                status: 'Conectado a través del servidor'
            };
        } else {
            throw new Error('El proxy no está devolviendo la página del ESP32');
        }
    } catch (error) {
        console.error('Error conectando al ESP32 a través del proxy:', error.message);
        
        // Información más detallada del error
        if (error.response) {
            console.error('Status error:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        
        throw new Error('No se pudo conectar al ESP32 a través del proxy. Verifica que el túnel esté activo.');
    }
};

// Función para obtener la IP configurada (ahora siempre es el proxy)
export const getESP32IP = () => {
    return 'Conectado vía proxy (at.opuntia.us/esp32/)';
};

// Función para configurar IP manualmente (ahora no es necesaria pero la mantenemos por compatibilidad)
export const setESP32IP = (ip) => {
    console.log('Configuración manual de IP deshabilitada - usando proxy automático');
    return true;
};

export const getCountdown = async () => {
    try {
        const response = await api.get('/countdown');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo countdown:', error);
        return "00:00";
    }
};

export const startCountdown = async (minutes, seconds) => {
    try {
        const response = await api.get(`/start?min=${minutes}&sec=${seconds}`);
        return response.data;
    } catch (error) {
        console.error('Error iniciando countdown:', error);
        throw error;
    }
};

export const stopCountdown = async () => {
    try {
        const response = await api.get('/off');
        return response.data;
    } catch (error) {
        console.error('Error deteniendo countdown:', error);
        throw error;
    }
};

export default api;