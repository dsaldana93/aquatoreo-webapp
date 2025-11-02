import React, { useState } from 'react';
import { setESP32IP, getESP32IP } from '../services/api';

function IPConfig({ onIPUpdated }) {
    const [showConfig, setShowConfig] = useState(false);
    const [ipAddress, setIpAddress] = useState(getESP32IP());
    const [saving, setSaving] = useState(false);

    const handleSaveIP = async () => {
        if (!ipAddress || !ipAddress.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
            alert('Por favor ingresa una dirección IP válida (ej: 192.168.100.68)');
            return;
        }

        setSaving(true);
        try {
            setESP32IP(ipAddress);
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
                    placeholder="192.168.100.68"
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
                        💡 Ingresa la IP local de tu ESP32. 
                        Encuentra la IP en el monitor serie o en tu router.
                    </small>
                </div>
            </div>
        </div>
    );
}

export default IPConfig;