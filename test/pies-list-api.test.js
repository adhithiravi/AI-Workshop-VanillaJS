/**
 * Test Suite for GET /api/pies endpoint
 * Tests various scenarios for the pies list API route
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/server');
const pies = require('../src/data/pies');
const { ALLOWED_CATEGORIES } = require('../src/config/constants');

describe('GET /api/pies', () => {
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

  test('should return 200 and all pies when no category filter provided', async () => {
    const response = await makeRequest('/api/pies');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const returnedPies = JSON.parse(response.body);
    assert(Array.isArray(returnedPies));
    assert.strictEqual(returnedPies.length, pies.length); // Total pies in data

    // Verify all expected pies are present
    const returnedPieIds = returnedPies.map(pie => pie.id);
    const expectedPieIds = pies.map(pie => pie.id);
    expectedPieIds.forEach(expectedId => {
      assert(returnedPieIds.includes(expectedId), `Should include pie with id: ${expectedId}`);
    });
  });

  test('should return 200 and all pies when category=all', async () => {
    const response = await makeRequest('/api/pies?category=all');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const returnedPies = JSON.parse(response.body);
    assert(Array.isArray(returnedPies));
    assert.strictEqual(returnedPies.length, pies.length); // Total pies in data
  });

  // Test each category dynamically
  for (const category of ALLOWED_CATEGORIES) {
    if (category === 'all') continue; // Skip 'all' as it's tested separately

    test(`should return 200 and only ${category} pies when category=${category}`, async () => {
      const response = await makeRequest(`/api/pies?category=${category}`);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

      const returnedPies = JSON.parse(response.body);
      assert(Array.isArray(returnedPies));

      // Calculate expected count for this category
      const expectedPies = pies.filter(pie => pie.category === category);
      assert.strictEqual(returnedPies.length, expectedPies.length);

      // Verify all returned pies are of the correct category
      returnedPies.forEach(pie => {
        assert.strictEqual(pie.category, category);
      });

      // Verify all expected pies are present
      const returnedPieIds = returnedPies.map(pie => pie.id);
      const expectedPieIds = expectedPies.map(pie => pie.id);
      expectedPieIds.forEach(expectedId => {
        assert(returnedPieIds.includes(expectedId), `Should include ${category} pie with id: ${expectedId}`);
      });
    });
  }

  test('should return 400 for non-existent category', async () => {
    const response = await makeRequest('/api/pies?category=nonexistent');

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should return 400 for invalid category', async () => {
    const response = await makeRequest('/api/pies?category=invalid');

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should handle case sensitivity for category parameter', async () => {
    const response = await makeRequest('/api/pies?category=FRUIT');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const pies = JSON.parse(response.body);
    assert(Array.isArray(pies));
    assert.strictEqual(pies.length, 3); // 3 fruit pies
  });

  test('should handle category parameter with extra whitespace', async () => {
    const response = await makeRequest('/api/pies?category=  fruit  ');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const pies = JSON.parse(response.body);
    assert(Array.isArray(pies));
    assert.strictEqual(pies.length, 3); // 3 fruit pies
  });

  test('should handle empty category parameter', async () => {
    const response = await makeRequest('/api/pies?category=');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const returnedPies = JSON.parse(response.body);
    assert(Array.isArray(returnedPies));
    assert.strictEqual(returnedPies.length, pies.length); // All pies when category is empty
  });

  test('should handle multiple category parameters (returns 400 for invalid)', async () => {
    const response = await makeRequest('/api/pies?category=fruit&category=cheesecake');

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should handle special characters in category parameter', async () => {
    const response = await makeRequest('/api/pies?category=fruit@#$');

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should handle numeric category parameter', async () => {
    const response = await makeRequest('/api/pies?category=123');

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should handle very long category parameter', async () => {
    const longCategory = 'a'.repeat(1000);
    const response = await makeRequest(`/api/pies?category=${longCategory}`);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const error = JSON.parse(response.body);
    assert.strictEqual(error.error, true);
    assert.strictEqual(error.message, `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  });

  test('should verify pie data structure integrity', async () => {
    const response = await makeRequest('/api/pies?category=fruit');

    assert.strictEqual(response.statusCode, 200);
    const pies = JSON.parse(response.body);

    pies.forEach(pie => {
      // Verify required fields exist
      assert(pie.id, 'Pie should have an id');
      assert(pie.name, 'Pie should have a name');
      assert(typeof pie.price === 'number', 'Pie should have a numeric price');
      assert(pie.description, 'Pie should have a description');
      assert(pie.category, 'Pie should have a category');
      assert(pie.image, 'Pie should have an image path');

      // Verify data types
      assert.strictEqual(typeof pie.id, 'string');
      assert.strictEqual(typeof pie.name, 'string');
      assert.strictEqual(typeof pie.price, 'number');
      assert.strictEqual(typeof pie.description, 'string');
      assert.strictEqual(typeof pie.category, 'string');
      assert.strictEqual(typeof pie.image, 'string');
    });
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
