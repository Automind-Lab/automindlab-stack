/**
 * AutoMindLab diagnostic HTTP server.
 * Exposes the enterprise consultation surface to consumer applications.
 */

const express = require('express');
const DiagnosticConsultationService = require('./consultation-service');

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

app.post('/api/diagnose', (req, res) => {
  const context = req.body || {};

  if (!context.symptom) {
    res.status(400).json({
      error: 'Missing required field: symptom',
    });
    return;
  }

  try {
    const enhancement = diagnosticService.consult(context);
    res.status(200).json(enhancement);
  } catch (error) {
    console.error('AutoMindLab diagnostic consultation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`AutoMindLab diagnostic consultation server listening on port ${port}`);
});

module.exports = app;
