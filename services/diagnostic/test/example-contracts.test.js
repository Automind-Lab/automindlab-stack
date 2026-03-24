const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJson(relativePath) {
  const absolute = path.join(__dirname, '..', '..', '..', relativePath);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

test('council review example matches expected shape', () => {
  const payload = readJson('config/examples/council-review.example.json');
  assert.equal(typeof payload.decision, 'string');
  assert.equal(Array.isArray(payload.seatReviews), true);
  assert.equal(typeof payload.synthesis, 'string');
  assert.equal(['low', 'medium', 'high'].includes(payload.confidence), true);
  assert.equal(typeof payload.escalate, 'boolean');
});

test('incident report example matches expected shape', () => {
  const payload = readJson('config/examples/incident-report.example.json');
  assert.equal(typeof payload.id, 'string');
  assert.equal(typeof payload.summary, 'string');
  assert.equal(['sev0', 'sev1', 'sev2', 'sev3'].includes(payload.severity), true);
  assert.equal(['open', 'mitigated', 'resolved'].includes(payload.status), true);
  assert.equal(['host', 'worker', 'diagnostic', 'workflow', 'repo'].includes(payload.affectedScope), true);
  assert.equal(typeof payload.nextAction, 'string');
});

test('incident triage workflow remains parseable JSON', () => {
  const payload = readJson('config/workflows/incident_triage.workflow.json');
  assert.equal(payload.name, 'incident_triage');
  assert.equal(Array.isArray(payload.steps), true);
  assert.ok(payload.steps.length >= 3);
});
