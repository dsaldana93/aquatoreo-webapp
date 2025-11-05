import React, { useState } from 'react';
import { setESP32IP, getESP32IP } from '../services/api';

function IPConfig({ onIPUpdated }) {
    const [showConfig, setShowConfig] = useState(false);
    const [ipAddress, setIpAddress] = useState(getESP32IP() || 'orthotropic-helena-inefficiently.ngrok-free.dev');
    const [saving, setSaving] = useState(false);

    const handleSaveIP = async () => {
        // Validación mejorada - FIXED para ngrok
        const value = (ipAddress || '').trim();
        
        // Patrones corregidos
        const ipPattern = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
        const hostnamePattern = /^(?!-)(?:(?:[a-zA-Z0-9-]{1,63}\.){1,})(?:[a-zA-Z]{2,63})$/;
        const localtunnelPattern = /^[a-zA-Z0-9-]+\.loca\.lt$/;
        
        // ✅ PATTERN NGROK CORREGIDO - más flexible
        const ngrokPattern = /^[a-zA-Z0-9-]+(?:-[a-zA-Z0-9-]+)*\.ngrok(?:-[a-zA-Z]+)*\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        
        const urlPattern = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?::\d+)?(?:\/.*)?$/;

        const isValid =
            ipPattern.test(value) ||
            hostnamePattern.test(value) ||
            localtunnelPattern.test(value) ||
            ngrokPattern.test(value) ||
            urlPattern.test(value);

        if (!value || !isValid) {
            alert('Por favor ingresa una dirección IP válida (ej: 192.168.100.68), un dominio válido (ej: ejemplo.com, free-pianos-cheer.loca.lt, orthotropic-helena-inefficiently.ngrok-free.dev) o una URL completa (ej: https://ejemplo.com)');
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

    // El resto del código permanece igual...
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
                    placeholder="192.168.100.68 o orthotropic-helena-inefficiently.ngrok-free.dev"
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
                        Ejemplos: 192.168.100.68 o orthotropic-helena-inefficiently.ngrok-free.dev
                    </small>
                </div>
            </div>
        </div>
    );
}

export default IPConfig;