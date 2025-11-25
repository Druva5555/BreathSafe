'use strict';

const { cache: cacheCfg } = require('../config');
const LruCache = require('./lruCache');

const cache = new LruCache(cacheCfg.maxEntries, cacheCfg.ttlMs);

// Auto cleanup stale entries
setInterval(() => cache.cleanup(), cacheCfg.cleanupIntervalMs).unref();

module.exports = cache;
