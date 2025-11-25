'use strict';

const cache = require('../cache');
const { fetchAqiByCity } = require('../services/aqiService');

function normalizeCity(q) {
  return q.trim().toLowerCase();
}

async function getAqi(req, res, next) {
  try {
    const q = (req.query.city || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "city" is required' });
    }
    const key = `aqi:${normalizeCity(q)}`;

    const cached = cache.get(key);
    if (cached) {
      return res.json({ fromCache: true, ...cached });
    }

    const data = await fetchAqiByCity(q);
    cache.set(key, data);

    res.json({ fromCache: false, ...data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAqi };
