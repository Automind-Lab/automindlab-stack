/**
 * AutoMindLab diagnostic consultation service.
 *
 * This is the enterprise-side consultation layer consumed by products such as
 * FLOWCOMMANDER. It owns runtime-side reasoning and returns advisory,
 * structured output without taking ownership of the business workflow.
 */

const COUNCIL_ROUTER = {
  low_pressure: ['NIKOLA_TESLA', 'ALBERT_EINSTEIN', 'MARCUS_AURELIUS'],
  pressure_oscillation: ['NIKOLA_TESLA', 'ALBERT_EINSTEIN', 'BOB_ROSS'],
  high_amps: ['ALBERT_EINSTEIN', 'MARCUS_AURELIUS', 'DAVID_GOGGINS'],
  pump_cycling: ['NIKOLA_TESLA', 'CARL_JUNG', 'BOB_ROSS'],
  lag_pump_not_engaging: ['NIKOLA_TESLA', 'ALBERT_EINSTEIN', 'DAVID_GOGGINS'],
  abnormal_frequency_behavior: ['NIKOLA_TESLA', 'ALBERT_EINSTEIN', 'CARL_JUNG'],
  communication_time_sync_anomaly: ['NIKOLA_TESLA', 'ALBERT_EINSTEIN', 'MARCUS_AURELIUS'],
  general_performance_issue: ['LEONARDO_DA_VINCI', 'CARL_JUNG', 'BOB_ROSS'],
};

const BASELINES = {
  low_pressure: {
    probableCauses: [
      { cause: 'Demand increase or inadequate lag support', confidence: 'medium' },
      { cause: 'Tuning issue or control-band weakness', confidence: 'medium' },
      { cause: 'Mechanical restriction or wear', confidence: 'low' },
    ],
    nextChecks: [
      'Capture steady-state discharge pressure versus setpoint.',
      'Capture lead pump frequency while demand is stable.',
      'Review lag threshold, alarm history, and control limits.',
      'Inspect for restriction if demand does not explain the pressure drop.',
    ],
    partsToConsider: [
      { part: 'Calibrated pressure gauge', reason: 'Independent pressure verification' },
      { part: 'Pressure transducer', reason: 'If sensing quality is questionable' },
    ],
    escalationCriteria: [
      'Pressure remains materially below setpoint after validation checks.',
      'Evidence suggests unsafe electrical or controls conditions.',
      'Restriction or mechanical wear cannot be safely resolved in the field.',
    ],
    closeOutNote: 'Technician validated low-pressure behavior and should document PSI, lead pump Hz, and whether demand, tuning, or restriction best explains the condition.',
    alternativePaths: [
      'If Hz is low with low pressure, prioritize controls and lag-threshold review.',
      'If Hz is high with low pressure, prioritize restriction and wear inspection.',
    ],
  },
  pressure_oscillation: {
    probableCauses: [
      { cause: 'Aggressive control behavior', confidence: 'medium' },
      { cause: 'Sensor noise or placement issue', confidence: 'medium' },
      { cause: 'Valve or mechanical instability', confidence: 'low' },
    ],
    nextChecks: [
      'Capture swing range and oscillation period.',
      'Confirm whether VFD output is hunting or stable.',
      'Inspect sensor location, wiring, and valve behavior.',
    ],
    partsToConsider: [
      { part: 'Pressure transducer', reason: 'If sensing instability is suspected' },
    ],
    escalationCriteria: [
      'Oscillation persists after sensing and control checks.',
      'Control instability risks service continuity or equipment stress.',
    ],
    closeOutNote: 'Technician observed oscillation and should document swing range, controller behavior, and whether sensing, tuning, or mechanical instability best matches the evidence.',
    alternativePaths: [
      'If the drive is hunting, review tuning before hardware replacement.',
      'If the drive is stable, inspect sensing and mechanical contributors first.',
    ],
  },
  high_amps: {
    probableCauses: [
      { cause: 'Mechanical load or restriction', confidence: 'medium' },
      { cause: 'Electrical imbalance or supply issue', confidence: 'medium' },
      { cause: 'Poor operating point', confidence: 'low' },
    ],
    nextChecks: [
      'Record running amps by phase and compare to nameplate.',
      'Validate voltage balance and controller faults.',
      'Inspect for binding, restriction, or wear.',
    ],
    partsToConsider: [
      { part: 'Clamp meter', reason: 'Per-phase current validation' },
      { part: 'Motor-protection components', reason: 'If overload behavior is confirmed' },
    ],
    escalationCriteria: [
      'Current remains abnormal after field validation.',
      'Voltage imbalance or electrical fault is detected.',
      'Mechanical drag or binding requires deeper teardown.',
    ],
    closeOutNote: 'Technician should document per-phase amps, electrical condition, and whether mechanical or electrical evidence best explains the elevated load.',
    alternativePaths: [
      'If electrical supply is unstable, pause mechanical assumptions and investigate power quality.',
      'If supply is normal, inspect restriction, wear, and pump loading.',
    ],
  },
  pump_cycling: {
    probableCauses: [
      { cause: 'Deadband or threshold issue', confidence: 'medium' },
      { cause: 'Tank or switch instability', confidence: 'medium' },
      { cause: 'Lag logic mismatch', confidence: 'low' },
    ],
    nextChecks: [
      'Document cycle interval and whether the pattern changes with demand.',
      'Review deadband, threshold, and switch behavior.',
      'Inspect tank condition and repeatability of the trigger.',
    ],
    partsToConsider: [
      { part: 'Pressure switch', reason: 'If switch repeatability is poor' },
      { part: 'Tank service kit', reason: 'If pressure-tank behavior is suspect' },
    ],
    escalationCriteria: [
      'Cycling persists after deadband and switch validation.',
      'The cycling pattern suggests a deeper controls defect.',
    ],
    closeOutNote: 'Technician should record cycle interval, demand context, and whether deadband, tank, switch, or lag logic best explains the repeated cycling.',
    alternativePaths: [
      'If cycling is steady and repeatable, review controls first.',
      'If cycling is erratic, inspect switch and tank behavior first.',
    ],
  },
  lag_pump_not_engaging: {
    probableCauses: [
      { cause: 'Missing lag call or inhibit state', confidence: 'medium' },
      { cause: 'Relay or wiring path issue', confidence: 'medium' },
      { cause: 'Settings mismatch', confidence: 'medium' },
    ],
    nextChecks: [
      'Verify the lag call condition against current lead load.',
      'Review alarm and inhibit history.',
      'Inspect relay, wiring, and enable-path settings.',
    ],
    partsToConsider: [
      { part: 'Control relay', reason: 'If command path integrity is suspect' },
      { part: 'I/O module parts', reason: 'If controller path appears degraded' },
    ],
    escalationCriteria: [
      'A valid lag call exists but the engagement path fails.',
      'The control path cannot be verified safely in the field.',
    ],
    closeOutNote: 'Technician should document whether a valid lag call was present, whether the control path was intact, and whether settings, faults, or hardware blocked engagement.',
    alternativePaths: [
      'If no valid lag call exists, investigate thresholds and mode settings first.',
      'If the call exists, inspect relay and wiring path next.',
    ],
  },
  abnormal_frequency_behavior: {
    probableCauses: [
      { cause: 'Limit mismatch or bad configuration', confidence: 'medium' },
      { cause: 'Noisy or invalid inputs', confidence: 'medium' },
      { cause: 'Mode bounce or controller-state issue', confidence: 'low' },
    ],
    nextChecks: [
      'Capture observed Hz trend over a useful time window.',
      'Compare the trend to configured min/max limits.',
      'Validate input quality and current control mode.',
    ],
    partsToConsider: [
      { part: 'Input module diagnostics', reason: 'If controller inputs are suspect' },
    ],
    escalationCriteria: [
      'Frequency behavior remains abnormal after limit and input validation.',
      'Controller-state instability cannot be resolved in field scope.',
    ],
    closeOutNote: 'Technician should document observed Hz pattern, configured range, and whether bad inputs, limits, or mode transitions best explain the behavior.',
    alternativePaths: [
      'If frequency violates configured limits, review configuration first.',
      'If configuration is sound, inspect inputs and mode transitions.',
    ],
  },
  communication_time_sync_anomaly: {
    probableCauses: [
      { cause: 'Gateway or network-path issue', confidence: 'medium' },
      { cause: 'Controller clock drift', confidence: 'medium' },
      { cause: 'Reference-clock problem', confidence: 'low' },
    ],
    nextChecks: [
      'Confirm whether the issue is isolated or site-wide.',
      'Validate gateway power, network path, and time-reference source.',
      'Record observed drift and communications symptoms.',
    ],
    partsToConsider: [
      { part: 'Gateway power supply', reason: 'If gateway stability is suspect' },
      { part: 'Network hardware spares', reason: 'If site communications path is unstable' },
    ],
    escalationCriteria: [
      'Shared communications or timing infrastructure appears compromised.',
      'The source of time drift cannot be isolated safely in field scope.',
    ],
    closeOutNote: 'Technician should document whether the issue was isolated or site-wide, along with gateway state, observed drift, and network-path condition.',
    alternativePaths: [
      'If one controller drifts alone, inspect that controller first.',
      'If the site drifts together, inspect shared gateway and timing path first.',
    ],
  },
  general_performance_issue: {
    probableCauses: [
      { cause: 'Demand or operating-context shift', confidence: 'medium' },
      { cause: 'Controls issue', confidence: 'medium' },
      { cause: 'Mechanical degradation', confidence: 'low' },
    ],
    nextChecks: [
      'Capture a concise issue summary tied to a time window.',
      'Review recent history and recurring alerts.',
      'Collect at least one strong field measurement tied to the complaint.',
    ],
    partsToConsider: [],
    escalationCriteria: [
      'The issue remains broad after first-pass measurement collection.',
      'The symptom pattern suggests a recurring unresolved defect.',
    ],
    closeOutNote: 'Technician should document operating context, recurrence pattern, and which first-pass measurements were collected to narrow the diagnosis.',
    alternativePaths: [
      'If the issue is recurring, start with history review.',
      'If the issue is new, prioritize current-state measurements.',
    ],
  },
};

class DiagnosticConsultationService {
  consult(context = {}) {
    const symptom = String(context.symptom || 'general_performance_issue').trim();
    const key = BASELINES[symptom] ? symptom : 'general_performance_issue';
    const baseline = BASELINES[key];
    const responses = Array.isArray(context.responses) ? context.responses : [];
    const siteContext = context.siteContext || {};
    const technicianContext = context.technicianContext || {};
    const recentAlerts = siteContext.recentAlerts || 'none';
    const skillLevel = technicianContext.skillLevel || 'unknown';

    const warnings = [];
    if (!responses.length) {
      warnings.push('No structured diagnostic responses were supplied.');
    }
    if (!siteContext.controllerType) {
      warnings.push('Controller type was not supplied.');
    }

    let confidence = 'medium';
    if (warnings.length >= 2) {
      confidence = 'low';
    }

    return {
      symptom: key,
      councilSeatsConsulted: COUNCIL_ROUTER[key] || [],
      probableCauses: baseline.probableCauses,
      nextChecks: baseline.nextChecks,
      partsToConsider: baseline.partsToConsider,
      escalationCriteria: baseline.escalationCriteria,
      closeOutNote: baseline.closeOutNote,
      alternativePaths: baseline.alternativePaths,
      confidence,
      runtimeNotes: [
        `Recent alerts context: ${recentAlerts}`,
        `Technician skill level: ${skillLevel}`,
      ],
      warnings,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = DiagnosticConsultationService;
