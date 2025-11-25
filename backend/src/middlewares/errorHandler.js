'use strict';

function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(`[Error] ${status} - ${message}`);
  }
  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
