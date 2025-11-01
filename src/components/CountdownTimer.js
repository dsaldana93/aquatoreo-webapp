import React, { useState } from 'react';

const CountdownTimer = ({ countdown, onStart, onStop, isConnected }) => {
    const [customMinutes, setCustomMinutes] = useState(0);
    const [customSeconds, setCustomSeconds] = useState(0);

    const handleQuickStart = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        onStart(minutes, seconds);
    };

    const handleCustomStart = () => {
        onStart(parseInt(customMinutes), parseInt(customSeconds));
    };

    return (
        <div>
            <div className="countdown-display">
                <div className="time">{countdown}</div>
            </div>

            <div className="controls">
                <button 
                    className="btn btn-primary"
                    onClick={() => handleQuickStart(10 * 60)}
                    disabled={!isConnected}
                >
                    ⏱️ 10 Minutos
                </button>
                <button 
                    className="btn btn-primary"
                    onClick={() => handleQuickStart(8 * 60)}
                    disabled={!isConnected}
                >
                    ⏱️ 8 Minutos
                </button>
                <button 
                    className="btn btn-primary"
                    onClick={() => handleQuickStart(5 * 60)}
                    disabled={!isConnected}
                >
                    ⏱️ 5 Minutos
                </button>
                <button 
                    className="btn btn-danger"
                    onClick={onStop}
                    disabled={!isConnected}
                >
                    ⏹️ Detener
                </button>
            </div>

            <div className="custom-time">
                <h3>⏰ Tiempo Personalizado</h3>
                <div className="form-group">
                    <label>Minutos:</label>
                    <input 
                        type="number" 
                        min="0" 
                        max="59"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Segundos:</label>
                    <input 
                        type="number" 
                        min="0" 
                        max="59"
                        value={customSeconds}
                        onChange={(e) => setCustomSeconds(e.target.value)}
                    />
                </div>
                <button 
                    className="btn btn-success"
                    onClick={handleCustomStart}
                    disabled={!isConnected}
                    style={{ width: '100%' }}
                >
                    🚀 Iniciar Cronómetro Personalizado
                </button>
            </div>
        </div>
    );
};

export default CountdownTimer;