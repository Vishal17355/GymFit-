import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, ApiError } from '../src/services/apiClient.js';

test('API client sends JSON and an injected bearer token without exposing an API key', async () => {
  let actual;
  const request = createApiClient({ baseUrl: 'https://example.test/', getAccessToken: async () => 'test-token', fetchImpl: async (url, options) => {
    actual = { url, options }; return new Response('{"saved":true}', { status: 201 });
  } });
  assert.deepEqual(await request('/api/v1/diet/profile', { method: 'POST', body: { age: 25 } }), { saved: true });
  assert.equal(actual.url, 'https://example.test/api/v1/diet/profile');
  assert.equal(actual.options.headers.Authorization, 'Bearer test-token');
  assert.equal(actual.options.body, '{"age":25}');
  assert.ok(!actual.url.includes('api_key'));
});

test('API client preserves validation errors and HTTP status', async () => {
  const request = createApiClient({ fetchImpl: async () => new Response(JSON.stringify({ code: 'VALIDATION', message: 'Check age', fields: { age: 'must be at least 14' } }), { status: 400 }) });
  await assert.rejects(request('/diet/profile'), (error) => error instanceof ApiError && error.status === 400 && error.fields.age === 'must be at least 14');
});

test('API client explains network and proxy failures instead of creating a local plan', async () => {
  const offline = createApiClient({ fetchImpl: async () => { throw new TypeError('Network error'); } });
  await assert.rejects(offline('/diet/plans'), /Cannot reach the Diet API/);
  const html = createApiClient({ fetchImpl: async () => new Response('<html>Vite fallback</html>') });
  await assert.rejects(html('/diet/plans'), /unexpected response/);
});

test('API client aborts requests that exceed the timeout', async () => {
  const request = createApiClient({ timeoutMs: 10, fetchImpl: (url, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))) });
  await assert.rejects(request('/diet/generate'), /timed out/);
});

test('API client supports empty successful responses', async () => {
  const request = createApiClient({ fetchImpl: async () => new Response(null, { status: 204 }) });
  assert.equal(await request('/empty'), null);
});
