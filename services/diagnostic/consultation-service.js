/**
 * AutoMindLab diagnostic consultation service.
 *
 * This adapter stays self-contained and runnable inside this repository.
 * It returns structured advisory output aligned with the Pump Specialist brief
 * without depending on council runtime classes that do not exist here.
 */

const COUNCIL_ROUTER = {
  lowPressure: ['Nikola Tesla', 'Albert Einstein', 'Marcus Aurelius'],
  pressureOscillation: ['Nikola Tesla', 'Albert Einstein', 'Bob Ross'],
  highAmps: ['Albert Einstein', 'Marcus Aurelius', 'David Goggins'],
  pumpCycling: ['Nikola Tesla', 'Carl Jung', 'Bob Ross'],
  lagPumpNotEngaging: ['Nikola Tesla', 'Albert Einstein', 'David Goggins'],
  abnormalFrequencyBehavior: ['Nikola Tesla', 'Albert Einstein', 'Carl Jung'],
  communicationTimeSyncAnomaly: ['Nikola Tesla', 'Albert Einstein', 'Marcus Aurelius'],
  generalPerformanceIssue: ['Leonardo da Vinci', 'Carl Jung', 'Bob Ross'],
};

const BASELINES = {
  lowPressure: {
    probableCauses: [
      { cause: 'Demand increase or inadequate lag support', confidence: 'medium', evidence: ['Low pressure commonly appears when real demand exceeds available support.'] },
      { cause: 'Control tuning weakness', confidence: 'medium', evidence: ['Weak control response can hold pressure below setpoint without a hard alarm.'] },
      { cause: 'Mechanical restriction or wear', confidence: 'low', evidence: ['Restriction, wear, or blockage can suppress pressure even when the pump is running.'] },
    ],
    nextChecks: [
      { action: 'Capture steady-state discharge pressure versus setpoint.', tool: 'Calibrated pressure gauge', safety: 'Standard LOTO and pressure awareness', priority: 'high' },
      { action: 'Capture lead pump frequency while demand is stable.', tool: 'HMI or VFD readout', safety: 'Observe electrical boundaries', priority: 'high' },
      { action: 'Review lag threshold, alarm history, and control limits.', tool: 'Controller or SCADA history', safety: 'No field disassembly required', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Pressure transducer', reason: 'If sensing quality is questionable', compatibility: 'Verify OEM and range', urgency: 'medium' },
      { part: 'Suction strainer service parts', reason: 'Restriction is a common low-pressure contributor', compatibility: 'Match station piping and basket size', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Pressure remains materially below setpoint after validation checks', threshold: '>10% below target', action: 'Escalate to senior technician or engineer', timeline: 'Within current service window' },
      { condition: 'Unsafe electrical or control condition is observed', threshold: 'Any credible safety concern', action: 'Stop work and escalate immediately', timeline: 'Immediate' },
    ],
    closeOutNote: 'Technician validated low-pressure behavior and should record PSI, lead pump Hz, and whether demand, tuning, or restriction best explains the condition.',
    alternativePaths: [
      { name: 'Controls-first review', description: 'If Hz is low while pressure is low, prioritize tuning and lag-threshold review.', trigger: 'Low pressure paired with unexpectedly low Hz' },
      { name: 'Mechanical restriction path', description: 'If Hz is high while pressure remains low, inspect for restriction, wear, or cavitation contributors.', trigger: 'Low pressure paired with elevated Hz' },
    ],
  },
  pressureOscillation: {
    probableCauses: [
      { cause: 'Aggressive control behavior', confidence: 'medium', evidence: ['Oscillation frequently points to unstable tuning.'] },
      { cause: 'Sensor noise or placement issue', confidence: 'medium', evidence: ['Poor sensing can drive false corrections.'] },
      { cause: 'Valve or mechanical instability', confidence: 'low', evidence: ['Mechanical instability can amplify otherwise small control swings.'] },
    ],
    nextChecks: [
      { action: 'Capture oscillation range and period.', tool: 'Trend log or gauge observation', safety: 'Standard PPE', priority: 'high' },
      { action: 'Confirm whether VFD output is hunting or stable.', tool: 'Drive display or trend view', safety: 'Observe electrical boundaries', priority: 'high' },
      { action: 'Inspect sensor location, wiring, and valve behavior.', tool: 'Inspection tools', safety: 'LOTO before touching wiring', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Pressure transducer', reason: 'If sensing instability is suspected', compatibility: 'Verify range and connector type', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Oscillation persists after sensing and control checks', threshold: 'Repeatable pattern remains present', action: 'Escalate for controls review', timeline: 'Same visit' },
    ],
    closeOutNote: 'Technician observed oscillation and should document swing range, controller behavior, and whether sensing, tuning, or mechanical instability best matches the evidence.',
    alternativePaths: [
      { name: 'Tuning review', description: 'If the drive is hunting, review control tuning before hardware replacement.', trigger: 'Oscillation accompanied by unstable output' },
      { name: 'Mechanical path', description: 'If drive output is stable, inspect valves, sensing, and hydraulic contributors.', trigger: 'Stable output but unstable pressure' },
    ],
  },
  highAmps: {
    probableCauses: [
      { cause: 'Mechanical load or restriction', confidence: 'medium', evidence: ['Mechanical drag and restriction are common current drivers.'] },
      { cause: 'Electrical imbalance or supply issue', confidence: 'medium', evidence: ['Voltage or phase imbalance can elevate current without matching demand.'] },
      { cause: 'Poor operating point', confidence: 'low', evidence: ['A bad operating point can increase load without an obvious discrete fault.'] },
    ],
    nextChecks: [
      { action: 'Record running amps by phase and compare to nameplate.', tool: 'Clamp meter', safety: 'Electrical PPE and LOTO boundaries', priority: 'high' },
      { action: 'Validate voltage balance and controller faults.', tool: 'Multimeter and controller logs', safety: 'Electrical PPE required', priority: 'high' },
      { action: 'Inspect for binding, restriction, or wear.', tool: 'Inspection tools', safety: 'Mechanical isolation before teardown', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Motor protection components', reason: 'If overload behavior is confirmed', compatibility: 'Match motor starter and rating', urgency: 'medium' },
      { part: 'Bearing kit', reason: 'If binding or noise is confirmed', compatibility: 'Verify motor/pump model', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Current remains abnormal after basic validation', threshold: '>10% above expected load', action: 'Escalate for electrical/mechanical deep dive', timeline: 'Same visit' },
      { condition: 'Electrical hazard is present', threshold: 'Any credible shock or overheating risk', action: 'Stop work and escalate immediately', timeline: 'Immediate' },
    ],
    closeOutNote: 'Technician should document per-phase amps, electrical condition, and whether mechanical or electrical evidence best explains the elevated load.',
    alternativePaths: [
      { name: 'Electrical supply path', description: 'If supply is unstable, investigate voltage quality and phase balance first.', trigger: 'Uneven phase current or poor voltage quality' },
      { name: 'Mechanical load path', description: 'If supply is normal, inspect restriction, wear, and rotating components.', trigger: 'Stable electrical supply with persistent high amps' },
    ],
  },
  pumpCycling: {
    probableCauses: [
      { cause: 'Deadband or threshold issue', confidence: 'medium', evidence: ['Short cycling often starts with overly tight control bands.'] },
      { cause: 'Tank or switch instability', confidence: 'medium', evidence: ['Erratic tank or switch behavior can retrigger the cycle repeatedly.'] },
      { cause: 'Lag logic mismatch', confidence: 'low', evidence: ['Lead-only cycling can be reinforced by lag logic that never engages correctly.'] },
    ],
    nextChecks: [
      { action: 'Document cycle interval and demand context.', tool: 'Trend log or manual observation', safety: 'Standard PPE', priority: 'high' },
      { action: 'Review deadband, threshold, and switch behavior.', tool: 'Controller settings and switch inspection', safety: 'LOTO before adjustment', priority: 'high' },
      { action: 'Inspect tank condition and trigger repeatability.', tool: 'Visual inspection and pressure reading', safety: 'Pressure awareness', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Pressure switch', reason: 'If switch repeatability is poor', compatibility: 'Verify pressure range and contacts', urgency: 'medium' },
      { part: 'Tank service kit', reason: 'If tank behavior is suspect', compatibility: 'Match tank model and bladder type', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Cycling persists after controls and switch validation', threshold: 'Recurring short-cycle behavior remains present', action: 'Escalate for controls review', timeline: 'Same visit' },
    ],
    closeOutNote: 'Technician should record cycle interval, demand context, and whether deadband, switch, tank, or lag logic best explains the repeated cycling.',
    alternativePaths: [
      { name: 'Controls-first review', description: 'If cycling is highly repeatable, review control band logic first.', trigger: 'Stable repeat cycle interval' },
      { name: 'Field hardware path', description: 'If cycling is erratic, inspect switch and tank condition first.', trigger: 'Erratic cycle interval' },
    ],
  },
  lagPumpNotEngaging: {
    probableCauses: [
      { cause: 'Missing lag call or inhibit state', confidence: 'medium', evidence: ['A lag pump often fails to engage because the call never becomes valid.'] },
      { cause: 'Relay or wiring path issue', confidence: 'medium', evidence: ['Broken command path can block engagement even when logic is correct.'] },
      { cause: 'Settings mismatch', confidence: 'medium', evidence: ['Threshold mismatch can prevent lag call generation.'] },
    ],
    nextChecks: [
      { action: 'Verify lag call condition against current lead load.', tool: 'Controller status view', safety: 'Standard PPE', priority: 'high' },
      { action: 'Review alarm and inhibit history.', tool: 'Controller logs', safety: 'No field disassembly required', priority: 'high' },
      { action: 'Inspect relay, wiring, and enable-path settings.', tool: 'Multimeter and wiring diagram', safety: 'Electrical PPE and LOTO', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Control relay', reason: 'If command path integrity is suspect', compatibility: 'Match coil and contact rating', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'A valid lag call exists but engagement still fails', threshold: 'Confirmed call with no actuation', action: 'Escalate for controls/electrical review', timeline: 'Same visit' },
    ],
    closeOutNote: 'Technician should document whether a valid lag call was present, whether the command path was intact, and whether settings, faults, or hardware blocked engagement.',
    alternativePaths: [
      { name: 'Threshold review', description: 'If no valid lag call exists, review thresholds and mode settings first.', trigger: 'No command generated' },
      { name: 'Command-path review', description: 'If the call exists, inspect relay and wiring path next.', trigger: 'Call present but no engagement' },
    ],
  },
  abnormalFrequencyBehavior: {
    probableCauses: [
      { cause: 'Limit mismatch or bad configuration', confidence: 'medium', evidence: ['Configured limits can create seemingly abnormal frequency patterns.'] },
      { cause: 'Noisy or invalid inputs', confidence: 'medium', evidence: ['Bad inputs can drive unstable frequency changes.'] },
      { cause: 'Mode bounce or controller-state issue', confidence: 'low', evidence: ['Rapid mode changes can produce confusing Hz behavior.'] },
    ],
    nextChecks: [
      { action: 'Capture observed Hz trend over a useful time window.', tool: 'Drive or SCADA trend view', safety: 'Standard PPE', priority: 'high' },
      { action: 'Compare the trend to configured min/max limits.', tool: 'Controller settings', safety: 'No field disassembly required', priority: 'high' },
      { action: 'Validate input quality and current control mode.', tool: 'Controller diagnostics', safety: 'LOTO before touching wiring', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Input module diagnostics', reason: 'If controller inputs are suspect', compatibility: 'Match controller platform', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Frequency behavior remains abnormal after limit and input validation', threshold: 'Repeatable abnormal Hz pattern remains present', action: 'Escalate for controls review', timeline: 'Same visit' },
    ],
    closeOutNote: 'Technician should document observed Hz pattern, configured range, and whether bad inputs, limits, or mode transitions best explain the behavior.',
    alternativePaths: [
      { name: 'Configuration path', description: 'If frequency violates configured limits, review configuration first.', trigger: 'Observed behavior conflicts with configuration' },
      { name: 'Input quality path', description: 'If configuration is sound, inspect inputs and mode transitions.', trigger: 'Configured limits appear correct' },
    ],
  },
  communicationTimeSyncAnomaly: {
    probableCauses: [
      { cause: 'Gateway or network-path issue', confidence: 'medium', evidence: ['Shared communications problems often surface as time-sync drift.'] },
      { cause: 'Controller clock drift', confidence: 'medium', evidence: ['One controller drifting alone usually points to local clock behavior.'] },
      { cause: 'Reference-clock problem', confidence: 'low', evidence: ['A bad shared reference can distort the whole site.'] },
    ],
    nextChecks: [
      { action: 'Confirm whether the issue is isolated or site-wide.', tool: 'Controller and gateway status', safety: 'Standard PPE', priority: 'high' },
      { action: 'Validate gateway power, network path, and time-reference source.', tool: 'Network diagnostics and inspection tools', safety: 'Electrical PPE as needed', priority: 'high' },
      { action: 'Record observed drift and communications symptoms.', tool: 'Trend logs', safety: 'No field disassembly required', priority: 'medium' },
    ],
    partsToConsider: [
      { part: 'Gateway power supply', reason: 'If gateway stability is suspect', compatibility: 'Match gateway model', urgency: 'medium' },
    ],
    escalationCriteria: [
      { condition: 'Shared communications or timing infrastructure appears compromised', threshold: 'Site-wide drift or comm loss', action: 'Escalate to controls/network support', timeline: 'Immediate' },
    ],
    closeOutNote: 'Technician should document whether the issue was isolated or site-wide, along with gateway state, observed drift, and network-path condition.',
    alternativePaths: [
      { name: 'Local controller path', description: 'If one controller drifts alone, inspect that controller first.', trigger: 'Isolated controller drift' },
      { name: 'Shared infrastructure path', description: 'If the site drifts together, inspect shared gateway and timing path first.', trigger: 'Site-wide time-sync anomaly' },
    ],
  },
  generalPerformanceIssue: {
    probableCauses: [
      { cause: 'Demand or operating-context shift', confidence: 'medium', evidence: ['Broad performance complaints often trace to site condition changes.'] },
      { cause: 'Controls issue', confidence: 'medium', evidence: ['General complaints commonly hide threshold or mode issues.'] },
      { cause: 'Mechanical degradation', confidence: 'low', evidence: ['Wear remains plausible until measurements narrow the field.'] },
    ],
    nextChecks: [
      { action: 'Capture a concise issue summary tied to a time window.', tool: 'Technician interview and log review', safety: 'Standard PPE', priority: 'high' },
      { action: 'Review recent history and recurring alerts.', tool: 'SCADA or controller history', safety: 'No field disassembly required', priority: 'high' },
      { action: 'Collect at least one strong field measurement tied to the complaint.', tool: 'Appropriate field instruments', safety: 'Standard LOTO where applicable', priority: 'medium' },
    ],
    partsToConsider: [],
    escalationCriteria: [
      { condition: 'Issue remains broad after first-pass measurement collection', threshold: 'No clear branch after initial triage', action: 'Escalate for deeper specialist review', timeline: 'Same visit' },
    ],
    closeOutNote: 'Technician should document operating context, recurrence pattern, and which first-pass measurements were collected to narrow the diagnosis.',
    alternativePaths: [
      { name: 'History-first review', description: 'If the issue is recurring, start with service history and recurring alerts.', trigger: 'Known repeat issue' },
      { name: 'Present-state triage', description: 'If the issue is new, prioritize current-state measurements.', trigger: 'New or first-time complaint' },
    ],
  },
};

class DiagnosticConsultationService {
  consult(context = {}) {
    try {
      const symptom = this.normalizeSymptom(context.symptom);
      const baseline = BASELINES[symptom];
      const warnings = [];

      if (!Array.isArray(context.responses) || context.responses.length === 0) {
        warnings.push('No structured diagnostic responses were supplied.');
      }
      if (!context.siteContext || !context.siteContext.controllerType) {
        warnings.push('Controller type was not supplied.');
      }

      return {
        probableCauses: baseline.probableCauses,
        nextChecks: baseline.nextChecks,
        partsToConsider: baseline.partsToConsider,
        escalationCriteria: baseline.escalationCriteria,
        closeOutNote: baseline.closeOutNote,
        alternativePaths: baseline.alternativePaths,
        metadata: {
          confidence: warnings.length >= 2 ? 'low' : 'medium',
          timestamp: new Date().toISOString(),
          consultationId: `consult_${Date.now()}`,
          dataQuality: warnings.length === 0 ? 'good' : 'fair',
          limitations: warnings.length === 0 ? ['No major limitations identified'] : warnings,
          originalSymptom: symptom,
          councilSeatsConsulted: COUNCIL_ROUTER[symptom] || [],
        },
      };
    } catch (error) {
      return this.getFallbackEnhancement(context.symptom, error.message);
    }
  }

  getFallbackEnhancement(symptom = 'generalPerformanceIssue', errorMessage = 'Unknown runtime error') {
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
        originalSymptom: this.normalizeSymptom(symptom),
        councilSeatsConsulted: [],
      },
    };
  }

  normalizeSymptom(symptom) {
    const known = Object.keys(BASELINES);
    return known.includes(symptom) ? symptom : 'generalPerformanceIssue';
  }
}

module.exports = DiagnosticConsultationService;
