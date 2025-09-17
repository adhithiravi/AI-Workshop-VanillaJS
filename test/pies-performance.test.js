/**
 * Performance Test Suite for GET /api/pies/:id endpoint
 * Tests latency performance for individual pie retrieval
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/server');
const pies = require('../src/data/pies');

describe('GET /api/pies/:id Performance', () => {
  let server;
  let baseUrl;

  before(() => {
    // Start server on ephemeral port (0 = random available port)
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`Performance test server running on ${baseUrl}`);
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        console.log('Performance test server closed');
        resolve();
      });
    });
  });

  test('should have p95 latency under 30ms for 30 requests to /api/pies/:id', async () => {
    const numRequests = 30;
    // Use the first pie from the data as the target
    const targetPie = pies[0];
    const targetPieId = targetPie.id;
    const maxP95Latency = 30; // milliseconds

    console.log(`Making ${numRequests} requests to /api/pies/${targetPieId} (${targetPie.name})...`);

    // Array to store response times
    const responseTimes = [];

    // Make 30 concurrent requests
    const requests = Array.from({ length: numRequests }, async (_, index) => {
      const startTime = process.hrtime.bigint();

      try {
        const response = await makeRequest(`/api/pies/${targetPieId}`);
        const endTime = process.hrtime.bigint();

        // Calculate response time in milliseconds
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        responseTimes.push(responseTimeMs);

        // Verify the response is successful
        assert.strictEqual(response.statusCode, 200, `Request ${index + 1} should return 200`);
        assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

        const pie = JSON.parse(response.body);
        assert.strictEqual(pie.id, targetPieId, `Request ${index + 1} should return correct pie`);
        assert.strictEqual(pie.name, targetPie.name, `Request ${index + 1} should return correct pie name`);

        return responseTimeMs;
      } catch (error) {
        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000;
        responseTimes.push(responseTimeMs);

        console.error(`Request ${index + 1} failed:`, error.message);
        throw error;
      }
    });

    // Wait for all requests to complete
    await Promise.all(requests);

    // Sort response times to calculate percentiles
    responseTimes.sort((a, b) => a - b);

    // Calculate p95 latency (95th percentile)
    const p95Index = Math.ceil((95 / 100) * responseTimes.length) - 1;
    const p95Latency = responseTimes[p95Index];

    // Calculate other useful metrics
    const minLatency = Math.min(...responseTimes);
    const maxLatency = Math.max(...responseTimes);
    const avgLatency = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const p50Latency = responseTimes[Math.ceil((50 / 100) * responseTimes.length) - 1];
    const p90Latency = responseTimes[Math.ceil((90 / 100) * responseTimes.length) - 1];

    // Log performance metrics
    console.log('\n=== Performance Metrics ===');
    console.log(`Total requests: ${responseTimes.length}`);
    console.log(`Min latency: ${minLatency.toFixed(2)}ms`);
    console.log(`Max latency: ${maxLatency.toFixed(2)}ms`);
    console.log(`Average latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`P50 latency: ${p50Latency.toFixed(2)}ms`);
    console.log(`P90 latency: ${p90Latency.toFixed(2)}ms`);
    console.log(`P95 latency: ${p95Latency.toFixed(2)}ms`);
    console.log('===========================\n');

    // Assert p95 latency is under 30ms
    assert(
      p95Latency < maxP95Latency,
      `P95 latency (${p95Latency.toFixed(2)}ms) should be under ${maxP95Latency}ms`
    );

    // Additional assertions for data quality
    assert.strictEqual(responseTimes.length, numRequests, 'All requests should complete');
    assert(avgLatency < 50, `Average latency (${avgLatency.toFixed(2)}ms) should be reasonable`);
    assert(maxLatency < 100, `Max latency (${maxLatency.toFixed(2)}ms) should not be excessive`);
  });

  test('should handle concurrent requests without errors', async () => {
    const numRequests = 10;
    // Use a different pie from the data for variety
    const targetPie = pies[1] || pies[0]; // Use second pie if available, otherwise first
    const targetPieId = targetPie.id;

    console.log(`Making ${numRequests} concurrent requests to /api/pies/${targetPieId} (${targetPie.name}) to verify stability...`);

    const requests = Array.from({ length: numRequests }, async (_, index) => {
      const response = await makeRequest(`/api/pies/${targetPieId}`);

      assert.strictEqual(response.statusCode, 200, `Concurrent request ${index + 1} should succeed`);
      assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');

      const pie = JSON.parse(response.body);
      assert.strictEqual(pie.id, targetPieId, `Concurrent request ${index + 1} should return correct pie`);
      assert.strictEqual(pie.name, targetPie.name, `Concurrent request ${index + 1} should return correct pie name`);

      return response;
    });

    // Wait for all requests to complete
    const responses = await Promise.all(requests);

    // Verify all responses are successful
    assert.strictEqual(responses.length, numRequests, 'All concurrent requests should complete');

    console.log(`All ${numRequests} concurrent requests completed successfully`);
  });

  /**
   * Helper function to make HTTP requests with timing
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
