const test = require('node:test');
const assert = require('node:assert/strict');
const DiagnosticConsultationService = require('../consultation-service');
const app = require('../server');

async function withServer(fn) {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

test('fallback response shape is returned when the service throws internally', () => {
  class BrokenService extends DiagnosticConsultationService {
    normalizeSymptom() {
      throw new Error('boom');
    }
  }

  const service = new BrokenService();
  const result = service.consult({ symptom: 'lowPressure' });

  assert.equal(result.metadata.confidence, 'low');
  assert.equal(Array.isArray(result.probableCauses), true);
  assert.equal(Array.isArray(result.nextChecks), true);
  assert.equal(Array.isArray(result.alternativePaths), true);
});

test('GET /api/health returns 200', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
  });
});

test('POST /api/diagnose returns 400 when symptom is missing', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses: [] }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, 'Missing required field: symptom');
  });
});

test('POST /api/diagnose returns a valid output schema for a known symptom', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptom: 'lowPressure',
        responses: [
          { stepKey: 'confirm-pressure', prompt: 'Confirm pressure', responseValue: '48 psi' },
        ],
        siteContext: {
          controllerType: 'VFD',
        },
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body.probableCauses), true);
    assert.equal(Array.isArray(body.nextChecks), true);
    assert.equal(Array.isArray(body.partsToConsider), true);
    assert.equal(Array.isArray(body.escalationCriteria), true);
    assert.equal(Array.isArray(body.alternativePaths), true);
    assert.equal(typeof body.closeOutNote, 'string');
    assert.equal(typeof body.metadata, 'object');
  });
});
