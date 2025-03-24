import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState("");

    const fetchForecast = async () => {
        setError("");
        setForecast(null);

        if (!city.trim()) {
            setError("Please enter a city name.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5001/hourly-forecast?city=${city}`);
            setForecast(response.data);
        } catch (err) {
            setError("Could not fetch weather data. Please check the city name.");
        }
    };

    return (
        <div className="app">
            <div className="sidebar">
                <h2>🌤️ Weather Forecast</h2>
                <input
                    type="text"
                    placeholder="Enter city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={fetchForecast}>Get Forecast</button>
                {error && <p className="error">{error}</p>}
            </div>

            <div className="forecast-section">
                {forecast ? (
                    Object.entries(forecast).map(([date, data]) => (
                        <div key={date} className="day-card">
                            <h3>{date}</h3>
                            <div className="hourly">
                                {data.map((entry, index) => (
                                    <div key={index} className="hour">
                                        <p className="time">{entry.time}</p>
                                        <p className="temp">🌡️ {entry.temp}°C</p>
                                        <p className="desc">{entry.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="placeholder">Enter a city and get the forecast!</p>
                )}
            </div>
        </div>
    );
};

export default App;
