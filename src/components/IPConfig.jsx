import React, { useState } from 'react';
import { setESP32IP, getESP32IP } from '../services/api';

function IPConfig({ onIPUpdated }) {
    const [showConfig, setShowConfig] = useState(false);
    const [ipAddress, setIpAddress] = useState(getESP32IP() || 'dull-oranges-rescue.loca.lt');
    const [saving, setSaving] = useState(false);

    const handleSaveIP = async () => {
        // Validación mejorada para aceptar IPs, dominios (multi-label), localtunnel, ngrok y URLs completas
        const value = (ipAddress || '').trim();
        const ipPattern = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
        const hostnamePattern = /^(?=.{1,253}$)(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/;
        const localtunnelPattern = /^[A-Za-z0-9-]+\.loca\.lt$/;
        const ngrokPattern = /^[A-Za-z0-9-]+\.ngrok(-free)?\.(dev|app)$/;
        const urlPattern = /^https?:\/\/[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+(?::\d+)?(?:\/.*)?$/;

        const isValid =
            ipPattern.test(value) ||
            hostnamePattern.test(value) ||
            localtunnelPattern.test(value) ||
            ngrokPattern.test(value) ||
            urlPattern.test(value);

        if (!value || !isValid) {
            alert('Por favor ingresa una dirección IP válida (ej: 192.168.100.68), un dominio válido (ej: ejemplo.com, free-pianos-cheer.loca.lt, subdominio.ngrok-free.dev) o una URL completa (ej: https://ejemplo.com)');
            return;
        }

        setSaving(true);
        try {
            setESP32IP(value);
            setShowConfig(false);
            if (onIPUpdated) {
                onIPUpdated();
            }
            alert('IP del ESP32 actualizada correctamente');
        } catch (error) {
            alert('Error actualizando la IP');
        } finally {
            setSaving(false);
        }
    };

    if (!showConfig) {
        return (
            <div className="ip-config-toggle">
                <button 
                    onClick={() => setShowConfig(true)}
                    className="config-btn"
                >
                    ⚙️ Configurar IP ESP32
                </button>
            </div>
        );
    }

    return (
        <div className="ip-config">
            <div className="config-header">
                <h3>🔧 Configuración ESP32</h3>
                <button 
                    onClick={() => setShowConfig(false)}
                    className="close-btn"
                >
                    ✕
                </button>
            </div>
            
            <div className="config-content">
                <label htmlFor="esp32-ip">IP del ESP32:</label>
                <input
                    id="esp32-ip"
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.100.68 o free-pianos-cheer.loca.lt"
                    disabled={saving}
                />
                
                <div className="config-buttons">
                    <button 
                        onClick={handleSaveIP}
                        disabled={saving}
                        className="save-btn"
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                        onClick={() => setShowConfig(false)}
                        className="cancel-btn"
                    >
                        Cancelar
                    </button>
                </div>
                
                <div className="config-help">
                    <small>
                        💡 Ingresa la IP local de tu ESP32 o un dominio de túnel. 
                        Ejemplos: 192.168.100.68 o free-pianos-cheer.loca.lt
                    </small>
                </div>
            </div>
        </div>
    );
}

export default IPConfig;