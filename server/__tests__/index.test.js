const request = require('supertest');
const app = require('../index');

describe('Server Tests', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
}); 