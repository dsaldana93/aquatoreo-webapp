import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer.jsx';
import IPConfig from './components/IPConfig.jsx';
import { getCountdown, startCountdown, stopCountdown, checkConnection } from './services/api';

function App() {
    const [countdown, setCountdown] = useState('00:00');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ipAddress, setIpAddress] = useState('');

    useEffect(() => {
        checkESP32Connection();
        const interval = setInterval(checkESP32Connection, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isConnected) {
            const countdownInterval = setInterval(updateCountdown, 1000);
            return () => clearInterval(countdownInterval);
        }
    }, [isConnected]);

    const checkESP32Connection = async () => {
        try {
            const response = await checkConnection();
            setIsConnected(true);
            setIpAddress(response.ip);
            setError('');
        } catch (err) {
            setIsConnected(false);
            setError('No se puede conectar al ESP32. Asegúrate de que esté en la misma red.');
        } finally {
            setLoading(false);
        }
    };

    const updateCountdown = async () => {
        try {
            const time = await getCountdown();
            setCountdown(time);
        } catch (err) {
            console.error('Error actualizando cronómetro:', err);
        }
    };

    const handleStartCountdown = async (minutes, seconds) => {
        try {
            await startCountdown(minutes, seconds);
            await updateCountdown();
            setError('');
        } catch (err) {
            setError('Error iniciando el cronómetro');
        }
    };

    const handleStopCountdown = async () => {
        try {
            await stopCountdown();
            await updateCountdown();
            setError('');
        } catch (err) {
            setError('Error deteniendo el cronómetro');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Conectando con ESP32...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>🏁 Control de Cronómetro ESP32</h1>
                <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? '✅ Conectado al ESP32' : '❌ Desconectado'}
                </div>
            </div>

            {!isConnected && (
                <IPConfig onIPUpdated={checkESP32Connection} />
            )}

            {error && <div className="error">{error}</div>}

            <CountdownTimer 
                countdown={countdown}
                onStart={handleStartCountdown}
                onStop={handleStopCountdown}
                isConnected={isConnected}
            />

            {isConnected && ipAddress && (
                <div className="connection-info">
                    <h3>Información de Conexión</h3>
                    <p><strong>IP del ESP32:</strong> {ipAddress}</p>
                    <p><strong>Estado:</strong> Conectado vía WiFi local</p>
                    <IPConfig onIPUpdated={checkESP32Connection} />
                </div>
            )}
        </div>
    );
}

export default App;