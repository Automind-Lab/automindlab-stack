const DiagnosticConsultationService = require('../consultation-service');

DiagnosticConsultationService.prototype.getFallbackEnhancement = function patchedGetFallbackEnhancement(
  symptom = 'generalPerformanceIssue',
  errorMessage = 'Unknown runtime error',
) {
  const known = [
    'lowPressure',
    'pressureOscillation',
    'highAmps',
    'pumpCycling',
    'lagPumpNotEngaging',
    'abnormalFrequencyBehavior',
    'communicationTimeSyncAnomaly',
    'generalPerformanceIssue',
  ];

  const originalSymptom = known.includes(symptom) ? symptom : 'generalPerformanceIssue';

  return {
    probableCauses: [
      { cause: 'Runtime consultation fallback was used', confidence: 'low', evidence: [errorMessage] },
    ],
    nextChecks: [
      { action: 'Verify measurements with calibrated equipment.', tool: 'Appropriate field instruments', safety: 'Standard LOTO and PPE', priority: 'high' },
      { action: 'Review recent service history and alert logs.', tool: 'Controller or SCADA history', safety: 'No field disassembly required', priority: 'medium' },
    ],
    partsToConsider: [],
    escalationCriteria: [
      { condition: 'Consultation confidence is low or runtime failed', threshold: 'Fallback path engaged', action: 'Escalate to senior technician or engineer', timeline: 'Same visit' },
    ],
    closeOutNote: 'Runtime fallback guidance used. Recommend field verification and specialist review if uncertainty remains.',
    alternativePaths: [
      { name: 'Manual expert review', description: 'Use senior technician judgment and manufacturer procedures when runtime guidance is unavailable.', trigger: 'Fallback path engaged' },
    ],
    metadata: {
      confidence: 'low',
      timestamp: new Date().toISOString(),
      consultationId: `fallback_${Date.now()}`,
      dataQuality: 'poor',
      limitations: ['Runtime fallback engaged', errorMessage],
      originalSymptom,
      councilSeatsConsulted: [],
    },
  };
};
