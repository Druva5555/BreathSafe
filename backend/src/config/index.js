'use strict';

const config = {
  port: process.env.PORT || 4000,
  aqicn: {
    token: process.env.AQICN_API_TOKEN || '',
    baseUrl: 'https://api.waqi.info',
    timeoutMs: 8000,
  },
  cache: {
    maxEntries: parseInt(process.env.CACHE_MAX_ENTRIES || '200', 10),
    ttlMs: parseInt(process.env.CACHE_TTL_MS || '600000', 10),
    cleanupIntervalMs: parseInt(process.env.CACHE_CLEANUP_MS || '60000', 10),
  }
};

module.exports = config;
