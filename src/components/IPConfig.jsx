const handleSaveIP = async () => {
    const value = (ipAddress || '').trim();
    
    // ✅ VALIDACIÓN SUPER SIMPLE Y EFECTIVA
    const isValid = (() => {
        if (!value) return false;
        
        // 1. IP address (192.168.1.1)
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return true;
        
        // 2. Cualquier dominio con puntos (incluye ngrok, localtunnel, etc.)
        if (/^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/.test(value)) return true;
        
        // 3. URL completa con http/https
        if (/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)) return true;
        
        return false;
    })();

    if (!isValid) {
        alert(`Dirección inválida. Ejemplos válidos:\n\n• 192.168.100.68\n• orthotropic-helena-inefficiently.ngrok-free.dev\n• dull-oranges-rescue.loca.lt\n• https://midominio.com`);
        return;
    }

    setSaving(true);
    try {
        setESP32IP(value);
        setShowConfig(false);
        if (onIPUpdated) {
            onIPUpdated();
        }
        alert('✅ Dirección del ESP32 actualizada correctamente');
    } catch (error) {
        alert('❌ Error actualizando la dirección');
        console.error('Error updating IP:', error);
    } finally {
        setSaving(false);
    }
};