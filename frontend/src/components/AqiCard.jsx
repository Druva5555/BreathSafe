import React from 'react';

function formatDate(iso) {
  if (!iso) return 'N/A';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AqiCard({ data }) {
  const { city, aqi, category, pollutants, dominentPol, time, source, fromCache } = data || {};
  const badgeStyle = {
    backgroundColor: category?.color || '#6b7280',
    color: '#fff'
  };

  const pols = [
    { key: 'pm25', label: 'PM2.5' },
    { key: 'pm10', label: 'PM10' },
    { key: 'no2', label: 'NO₂' },
    { key: 'so2', label: 'SO₂' },
    { key: 'co', label: 'CO' },
    { key: 'o3', label: 'O₃' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{city?.name || 'Unknown City'}</h2>
          <p className="text-sm text-slate-500">
            {city?.geo ? `(${city.geo[0]}, ${city.geo[1]})` : ''}
          </p>
          {dominentPol && (
            <p className="mt-1 text-xs text-slate-500">Dominant pollutant: {dominentPol.toUpperCase()}</p>
          )}
        </div>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-lg font-bold"
            style={badgeStyle}
            title={category?.label}
          >
            AQI {aqi ?? 'N/A'}
          </div>
          <div className="text-xs text-slate-600 mt-1 text-right">{category?.label || 'Unknown'}</div>
          {fromCache && (
            <div className="text-[10px] text-slate-400 mt-1">(cached)</div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pols.map((p) => (
          <div key={p.key} className="rounded border border-slate-200 p-3">
            <div className="text-xs text-slate-500">{p.label}</div>
            <div className="text-lg font-semibold">{pollutants?.[p.key] ?? '—'}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-600">
        <div>
          Last updated: <span className="font-medium">{formatDate(time?.iso) }</span> {time?.tz ? `(${time.tz})` : ''}
        </div>
        <div>
          Source:{' '}
          <a
            className="text-blue-600 hover:underline"
            href={city?.url || source?.website}
            target="_blank"
            rel="noreferrer"
          >
            {source?.name || 'WAQI'}
          </a>
        </div>
      </div>
    </div>
  );
}
