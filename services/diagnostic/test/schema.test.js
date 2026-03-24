const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const DiagnosticConsultationService = require('../consultation-service');

function assertHasKeys(obj, keys) {
  for (const key of keys) {
    assert.ok(Object.prototype.hasOwnProperty.call(obj, key), `missing key: ${key}`);
  }
}

test('diagnostic response includes keys required by schema', () => {
  const service = new DiagnosticConsultationService();
  const response = service.consult({
    symptom: 'lowPressure',
    responses: [{ stepKey: 'pressure', prompt: 'Pressure', responseValue: '48 psi' }],
    siteContext: { controllerType: 'VFD' },
  });

  const schemaPath = path.join(__dirname, '..', '..', '..', 'config', 'schemas', 'diagnostic-response.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  assertHasKeys(response, schema.required);
  assertHasKeys(response.metadata, schema.properties.metadata.required);
  assert.equal(Array.isArray(response.probableCauses), true);
  assert.equal(Array.isArray(response.nextChecks), true);
  assert.equal(Array.isArray(response.alternativePaths), true);
});
