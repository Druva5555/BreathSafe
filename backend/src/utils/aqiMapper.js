'use strict';

/**
 * Maps the World Air Quality Index (WAQI) API response to the app's domain model.
 * Provider docs: https://aqicn.org/api/
 * Example endpoint used: https://api.waqi.info/feed/{city}/?token={TOKEN}
 */
function aqiCategory(aqi) {
  if (aqi == null || Number.isNaN(aqi)) {
    return { label: 'Unknown', level: 'unknown', color: '#6b7280' }; // gray-500
  }
  if (aqi <= 50) return { label: 'Good', level: 'good', color: '#22c55e' }; // green-500
  if (aqi <= 100) return { label: 'Moderate', level: 'moderate', color: '#eab308' }; // yellow-500
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', level: 'usg', color: '#f97316' }; // orange-500
  if (aqi <= 200) return { label: 'Unhealthy', level: 'unhealthy', color: '#ef4444' }; // red-500
  if (aqi <= 300) return { label: 'Very Unhealthy', level: 'very_unhealthy', color: '#a855f7' }; // purple-500
  return { label: 'Hazardous', level: 'hazardous', color: '#7f1d1d' }; // maroon-900
}

function mapAqiResponse(payload) {
  const d = payload?.data || {};
  const city = {
    name: d?.city?.name || (typeof d?.city === 'string' ? d.city : null),
    geo: Array.isArray(d?.city?.geo) ? d.city.geo : null,
    url: d?.city?.url || null,
  };
  const pollutants = {
    pm25: d?.iaqi?.pm25?.v ?? null,
    pm10: d?.iaqi?.pm10?.v ?? null,
    no2: d?.iaqi?.no2?.v ?? null,
    so2: d?.iaqi?.so2?.v ?? null,
    co: d?.iaqi?.co?.v ?? null,
    o3: d?.iaqi?.o3?.v ?? null,
  };
  const cat = aqiCategory(d?.aqi);

  return {
    city,
    aqi: d?.aqi ?? null,
    category: cat,
    dominentPol: d?.dominentpol || null,
    pollutants,
    time: {
      iso: d?.time?.iso || null,
      tz: d?.time?.tz || null,
      s: d?.time?.s || null,
    },
    source: {
      name: 'World Air Quality Index',
      website: 'https://aqicn.org',
    },
  };
}

module.exports = { mapAqiResponse, aqiCategory };
