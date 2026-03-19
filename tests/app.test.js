const request = require('supertest');
const app     = require('../src/app');

describe('Health check', () => {
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('Orders API', () => {
  test('GET /api/orders returns order list', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(res.body.orders).toBeInstanceOf(Array);
    expect(res.body.orders.length).toBeGreaterThan(0);
    expect(res.body.orders[0]).toHaveProperty('id');
    expect(res.body.orders[0]).toHaveProperty('status');
  });
});

describe('Streaming API', () => {
  test('GET /api/stream returns show list', async () => {
    const res = await request(app).get('/api/stream');
    expect(res.statusCode).toBe(200);
    expect(res.body.shows).toBeInstanceOf(Array);
    expect(res.body.shows[0]).toHaveProperty('title');
    expect(res.body.shows[0]).toHaveProperty('rating');
  });
});

describe('Metrics endpoint', () => {
  test('GET /metrics returns prometheus format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });
});

describe('404 handler', () => {
  test('Unknown route returns 404', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});