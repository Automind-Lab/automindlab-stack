const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJson(relativePath) {
  const absolute = path.join(__dirname, '..', '..', '..', relativePath);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

test('diagnostic response schema declares required top-level keys', () => {
  const schema = readJson('config/schemas/diagnostic-response.schema.json');
  assert.equal(schema.type, 'object');
  assert.equal(Array.isArray(schema.required), true);
  for (const key of ['probableCauses', 'nextChecks', 'metadata']) {
    assert.equal(schema.required.includes(key), true);
  }
});

test('browser research schema declares required top-level keys', () => {
  const schema = readJson('config/schemas/browser-research-result.schema.json');
  assert.equal(schema.type, 'object');
  assert.equal(Array.isArray(schema.required), true);
  for (const key of ['goal', 'visited', 'findings', 'uncertainty', 'escalate']) {
    assert.equal(schema.required.includes(key), true);
  }
});

test('workflow config files remain parseable JSON', () => {
  const workflowDir = path.join(__dirname, '..', '..', '..', 'config', 'workflows');
  const files = fs.readdirSync(workflowDir).filter((name) => name.endsWith('.json'));
  assert.ok(files.length >= 3);
  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(workflowDir, file), 'utf8'));
    assert.equal(typeof payload.name, 'string');
    assert.equal(Array.isArray(payload.steps), true);
  }
});
