/**
 * Test Suite for GET /api/pies/:id endpoint
 * Tests various scenarios for the pie by ID API route
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/server');

describe('GET /api/pies/:id', () => {
  let server;
  let baseUrl;

  before(() => {
    // Start server on ephemeral port (0 = random available port)
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`Test server running on ${baseUrl}`);
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        console.log('Test server closed');
        resolve();
      });
    });
  });

  test('should return 200 and pie data for valid id (f1)', async () => {
    const response = await makeRequest('/api/pies/f1');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const pie = JSON.parse(response.body);
    assert.strictEqual(pie.id, 'f1');
    assert.strictEqual(pie.name, 'Classic Apple Pie');
    assert.strictEqual(pie.price, 12.95);
    assert.strictEqual(pie.category, 'fruit');
    assert.strictEqual(pie.description, 'Made with fresh apples and a flaky crust');
    assert.strictEqual(pie.image, '/images/Fruit/fruit1.png');
  });

  test('should return 200 and pie data for another valid id (c1)', async () => {
    const response = await makeRequest('/api/pies/c1');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const pie = JSON.parse(response.body);
    assert.strictEqual(pie.id, 'c1');
    assert.strictEqual(pie.name, 'Classic New York Cheesecake');
    assert.strictEqual(pie.price, 16.95);
    assert.strictEqual(pie.category, 'cheesecake');
  });

  test('should return 200 and pie data for seasonal id (s1)', async () => {
    const response = await makeRequest('/api/pies/s1');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const pie = JSON.parse(response.body);
    assert.strictEqual(pie.id, 's1');
    assert.strictEqual(pie.name, 'Pumpkin Pie');
    assert.strictEqual(pie.category, 'seasonal');
  });

  test('should return 404 for non-existent id', async () => {
    const response = await makeRequest('/api/pies/nonexistent');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  test('should return 404 for empty id parameter', async () => {
    const response = await makeRequest('/api/pies/""');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  test('should return 404 for id with special characters', async () => {
    const response = await makeRequest('/api/pies/f1@#$');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  test('should return 404 for numeric id that does not exist', async () => {
    const response = await makeRequest('/api/pies/999');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  test('should handle case sensitivity correctly', async () => {
    const response = await makeRequest('/api/pies/F1');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  test('should return 404 for id with spaces', async () => {
    const response = await makeRequest('/api/pies/f 1');

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, 'Pie not found');
  });

  /**
   * Helper function to make HTTP requests
   * @param {string} path - The API path to request
   * @returns {Promise<{statusCode: number, headers: object, body: string}>}
   */
  function makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.end();
    });
  }
});
