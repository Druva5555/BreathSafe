'use strict';

const axios = require('axios');
const { aqicn } = require('../config');
const { mapAqiResponse } = require('../utils/aqiMapper');

/**
 * Calls the WAQI API to fetch AQI for a city.
 * Endpoint: GET https://api.waqi.info/feed/{city}/?token={TOKEN}
 * Note: You must set the AQICN_API_TOKEN env var with your API token.
 */
async function fetchAqiByCity(city) {
  if (!aqicn.token) {
    const err = new Error('AQICN_API_TOKEN is not set. Please configure your API token in the backend .env file.');
    err.status = 500;
    throw err;
  }
  const url = `${aqicn.baseUrl}/feed/${encodeURIComponent(city)}/?token=${aqicn.token}`;

  try {
    const res = await axios.get(url, { timeout: aqicn.timeoutMs });
    const payload = res.data;
    if (!payload || payload.status !== 'ok') {
      const message = payload?.data ?? payload?.message ?? 'AQI provider returned an error';
      const msgStr = typeof message === 'string' ? message : 'AQI provider error';
      const lower = msgStr.toLowerCase();
      const err = new Error(msgStr);
      if (lower.includes('unknown') || lower.includes('not found')) {
        err.status = 404;
      } else if (lower.includes('invalid key') || lower.includes('token')) {
        err.status = 401;
      } else {
        err.status = 502;
      }
      throw err;
    }
    return mapAqiResponse(payload);
  } catch (e) {
    if (e.response) {
      // If provider returned an application error with message, try to map it
      const providerMsg = e.response.data?.data || e.response.data?.message;
      if (typeof providerMsg === 'string') {
        const lower = providerMsg.toLowerCase();
        const err = new Error(providerMsg);
        if (lower.includes('unknown') || lower.includes('not found')) {
          err.status = 404;
          throw err;
        }
        if (lower.includes('invalid key') || lower.includes('token')) {
          err.status = 401;
          throw err;
        }
      }
      const err = new Error(`AQI provider error: HTTP ${e.response.status}`);
      err.status = 502;
      throw err;
    }
    if (e.code === 'ECONNABORTED') {
      const err = new Error('AQI provider timeout');
      err.status = 504;
      throw err;
    }
    if (e.status) throw e;
    const err = new Error(`Failed to fetch AQI: ${e.message}`);
    err.status = 502;
    throw err;
  }
}

module.exports = { fetchAqiByCity };
