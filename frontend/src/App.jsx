import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar.jsx';
import AqiCard from './components/AqiCard.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(city) {
    const q = city?.trim();
    if (!q) {
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.get('/api/aqi', { params: { city: q } });
      setResult(res.data);
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || 'Failed to fetch AQI';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold">BreathSafe</h1>
          <p className="text-sm text-slate-600 mt-1">Find air quality by city. Data from WAQI.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={() => handleSearch(query)}
        />

        {loading && (
          <div className="mt-8 animate-pulse text-slate-600">Loading air quality…</div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result && !error && !loading && (
          <div className="mt-8">
            <AqiCard data={result} />
          </div>
        )}

        {!result && !loading && !error && (
          <p className="mt-8 text-slate-500 text-sm">Try searching for "Delhi", "Mumbai", "Bengaluru", "London"…</p>
        )}
      </main>

      <footer className="text-center text-xs text-slate-500 py-6">
        Built with React + Tailwind. Source: WAQI.
      </footer>
    </div>
  );
}
