import { useState } from 'react';
import './App.css';

function Weather() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(`http://localhost:3000/weather?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Weather Info</h2>
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          Get Weather
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {weather && (
        <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: 8 }}>
          <h3>Weather for {location}</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(weather, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Weather;