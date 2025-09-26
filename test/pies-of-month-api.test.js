/**
 * Test Suite for GET /api/pies-of-the-month endpoint
 * Tests various scenarios for the pies of the month API route
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/server');
const { getPiesOfTheMonth } = require('../src/helpers/piesHelper');
const pies = require('../src/data/pies');

describe('GET /api/pies-of-the-month', () => {
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

  test('should return 200 and pies of the month in correct order', async () => {
    const response = await makeRequest('/api/pies-of-the-month');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const returnedPies = JSON.parse(response.body);
    assert(Array.isArray(returnedPies));

    // Get expected pies of the month from helper function
    const expectedPies = getPiesOfTheMonth(pies);
    assert.strictEqual(returnedPies.length, expectedPies.length);

    // Verify correct order and IDs
    returnedPies.forEach((pie, index) => {
      assert.strictEqual(pie.id, expectedPies[index].id, `Pie at index ${index} should have correct ID`);
    });
  });

  test('should return correct pie data for pies of the month', async () => {
    const response = await makeRequest('/api/pies-of-the-month');

    assert.strictEqual(response.statusCode, 200);
    const returnedPies = JSON.parse(response.body);

    // Get expected pies of the month from helper function
    const expectedPies = getPiesOfTheMonth(pies);

    // Verify each pie matches the expected data
    returnedPies.forEach((pie, index) => {
      const expectedPie = expectedPies[index];
      assert.strictEqual(pie.id, expectedPie.id, `Pie ${index} should have correct ID`);
      assert.strictEqual(pie.name, expectedPie.name, `Pie ${index} should have correct name`);
      assert.strictEqual(pie.price, expectedPie.price, `Pie ${index} should have correct price`);
      assert.strictEqual(pie.category, expectedPie.category, `Pie ${index} should have correct category`);
      assert.strictEqual(pie.description, expectedPie.description, `Pie ${index} should have correct description`);
      assert.strictEqual(pie.image, expectedPie.image, `Pie ${index} should have correct image`);
    });
  });

  test('should return consistent results on multiple requests', async () => {
    const response1 = await makeRequest('/api/pies-of-the-month');
    const response2 = await makeRequest('/api/pies-of-the-month');

    assert.strictEqual(response1.statusCode, 200);
    assert.strictEqual(response2.statusCode, 200);

    const returnedPies1 = JSON.parse(response1.body);
    const returnedPies2 = JSON.parse(response2.body);

    // Results should be identical
    assert.strictEqual(returnedPies1.length, returnedPies2.length);
    assert.deepStrictEqual(returnedPies1, returnedPies2);
  });

  test('should handle query parameters gracefully (ignores them)', async () => {
    const response = await makeRequest('/api/pies-of-the-month?category=fruit&random=param');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

    const returnedPies = JSON.parse(response.body);
    assert(Array.isArray(returnedPies));

    // Get expected pies of the month from helper function
    const expectedPies = getPiesOfTheMonth(pies);
    assert.strictEqual(returnedPies.length, expectedPies.length);
  });

  test('should verify data structure integrity for pies of the month', async () => {
    const response = await makeRequest('/api/pies-of-the-month');

    assert.strictEqual(response.statusCode, 200);
    const returnedPies = JSON.parse(response.body);

    returnedPies.forEach(pie => {
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

      // Verify price is positive
      assert(pie.price > 0, 'Pie price should be positive');
    });
  });

  test('should handle malformed URL gracefully', async () => {
    const response = await makeRequest('/api/pies-of-the-month/extra/path');

    // This should return 200 with HTML content as Express serves a 404 page
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'text/html; charset=UTF-8');
  });

  test('should handle URL encoding in path', async () => {
    const response = await makeRequest('/api/pies-of-the-month%20');

    // This should return 200 with HTML content as the encoded space doesn't match the route
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers['content-type'], 'text/html; charset=UTF-8');
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
