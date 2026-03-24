const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJson(relativePath) {
  const absolute = path.join(__dirname, '..', '..', '..', relativePath);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

test('memory entry schema declares required top-level keys', () => {
  const schema = readJson('config/schemas/memory-entry.schema.json');
  assert.equal(schema.type, 'object');
  assert.equal(Array.isArray(schema.required), true);
  for (const key of ['id', 'type', 'summary', 'sourceRefs', 'confidence', 'scope']) {
    assert.equal(schema.required.includes(key), true);
  }
});

test('memory entry schema constrains confidence and scope', () => {
  const schema = readJson('config/schemas/memory-entry.schema.json');
  assert.deepEqual(schema.properties.confidence.enum, ['low', 'medium', 'high']);
  assert.deepEqual(schema.properties.scope.enum, ['runtime', 'diagnostic', 'operator']);
});
