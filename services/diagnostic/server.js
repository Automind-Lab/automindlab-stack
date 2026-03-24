/**
 * AutoMindLab diagnostic HTTP server.
 * Exposes the enterprise consultation surface to consumer applications.
 */

const express = require('express');
const DiagnosticConsultationService = require('./consultation-service');

const CONTRACT_VERSION = '2026-03-24.v1';

const app = express();
const diagnosticService = new DiagnosticConsultationService();
const port = Number(process.env.PORT || 3001);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'automindlab-diagnostic-consultation',
  });
});

app.post('/api/diagnose', async (req, res) => {
  const context = req.body || {};

  if (!context.symptom) {
    return res.status(400).json({
      contract_version: CONTRACT_VERSION,
      advisory: true,
      status: 'error',
      output: null,
      uncertainty: 'Missing required field: symptom',
      safe_action: 'Provide symptom and retry',
      escalation: false,
      metadata: {},
    });
  }

  try {
    const enhancement = await diagnosticService.consult(context);

    return res.status(200).json({
      contract_version: CONTRACT_VERSION,
      advisory: true,
      status: 'ok',
      output: enhancement,
      uncertainty: null,
      safe_action: 'Review suggested checks before acting',
      escalation: false,
      metadata: enhancement.metadata || {},
    });
  } catch (error) {
    console.error('AutoMindLab diagnostic consultation error:', error);
    const fallback = diagnosticService.getFallbackEnhancement(
      context.symptom,
      error.message
    );

    return res.status(200).json({
      contract_version: CONTRACT_VERSION,
      advisory: true,
      status: 'partial',
      output: fallback,
      uncertainty: error.message,
      safe_action: 'Fallback used — escalate if uncertainty remains',
      escalation: true,
      metadata: fallback.metadata || {},
    });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`AutoMindLab diagnostic consultation server listening on port ${port}`);
  });
}

module.exports = app;
