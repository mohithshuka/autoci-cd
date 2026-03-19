const express = require('express');
const client  = require('prom-client');

const app      = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const responseTime = new client.Histogram({
  name: 'http_response_time_ms',
  help: 'HTTP response time in milliseconds',
  labelNames: ['method', 'route'],
  buckets: [10, 50, 100, 200, 500, 1000],
  registers: [register],
});

app.use((req, res, next) => {
  const end = responseTime.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
  });
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/orders', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 2e6; i++) sum += i;
  res.json({
    orders: [
      { id: 1, item: 'Margherita Pizza',  status: 'delivered',  total: 299 },
      { id: 2, item: 'Chicken Biryani',   status: 'preparing',  total: 349 },
      { id: 3, item: 'Veg Burger',        status: 'on the way', total: 149 },
    ],
    meta: { count: 3, processed: sum },
  });
});

app.get('/api/stream', (req, res) => {
  const shows = [
    { id: 1, title: 'Breaking Bad',    genre: 'Drama',   rating: 9.5 },
    { id: 2, title: 'Stranger Things', genre: 'Sci-Fi',  rating: 8.7 },
    { id: 3, title: 'The Crown',       genre: 'History', rating: 8.6 },
  ];
  res.json({ shows, meta: { count: shows.length } });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Metrics at   http://localhost:${PORT}/metrics`);
  });
}

module.exports = app;