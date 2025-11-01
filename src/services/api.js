import axios from 'axios';

// Configuración base - necesitarás ajustar esta IP
const ESP32_BASE_URL = 'http://192.168.1.100'; // Cambia por la IP real de tu ESP32

const api = axios.create({
    baseURL: ESP32_BASE_URL,
    timeout: 5000,
});

export const checkConnection = async () => {
    try {
        // Intentamos obtener la página principal para verificar conexión
        await api.get('/');
        return { connected: true, ip: ESP32_BASE_URL.replace('http://', '') };
    } catch (error) {
        throw new Error('No se pudo conectar al ESP32');
    }
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