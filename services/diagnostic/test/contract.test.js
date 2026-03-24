const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('diagnose returns contract envelope on success', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom: 'lowPressure',
        responses: [],
      }),
    });

    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(json.contract_version, '2026-03-24.v1');
    assert.equal(json.advisory, true);
    assert.equal(typeof json.status, 'string');
    assert.ok(Object.prototype.hasOwnProperty.call(json, 'output'));
    assert.equal(typeof json.safe_action, 'string');
  } finally {
    server.close();
  }
});

test('diagnose returns structured contract error when symptom is missing', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses: [] }),
    });
    const json = await response.json();
    assert.equal(response.status, 400);
    assert.equal(json.status, 'error');
    assert.equal(json.advisory, true);
  } finally {
    server.close();
  }
});
