/**
 * Test Suite for GET /api/pies/:id endpoint
 * Tests various scenarios for the pie by ID API route
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/server');
const pies = require('../src/data/pies');

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

  // Test all valid pie IDs dynamically
  for (const pie of pies) {
    test(`should return 200 and pie data for valid id (${pie.id})`, async () => {
      const response = await makeRequest(`/api/pies/${pie.id}`);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

      const returnedPie = JSON.parse(response.body);
      assert.strictEqual(returnedPie.id, pie.id);
      assert.strictEqual(returnedPie.name, pie.name);
      assert.strictEqual(returnedPie.price, pie.price);
      assert.strictEqual(returnedPie.category, pie.category);
      assert.strictEqual(returnedPie.description, pie.description);
      assert.strictEqual(returnedPie.image, pie.image);
    });
  }

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
