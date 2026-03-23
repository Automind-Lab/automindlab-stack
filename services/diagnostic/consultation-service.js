/**
 * Diagnostic Consultation Service for AutoMindLab Stack
 * Provides Pump Specialist guidance to enhance FLOWCOMMANDER diagnostic workflows
 */

const { Prismo } = require('../../context/council/PRISMO');
const { AutoMindLab } = require('../../context/council/AUTOMINDLAB');
const { PumpSpecialist } = require('../diagnostic/PUMP_SPECIALIST');

class DiagnosticConsultationService {
  constructor() {
    this.prismo = new Prismo();
    this.automindlab = new AutoMindLab();
    this.pumpSpecialist = new PumpSpecialist();
  }

  /**
   * Consult with pump specialist for diagnostic enhancement
   * @param {Object} context - Diagnostic context from FLOWCOMMANDER
   * @returns {Promise<Object>} Structured enhancement recommendations
   */
  async consult(context) {
    try {
      // Extract and validate key information
      const { symptom, responses, siteContext, technicianContext, environmentalContext, safetyContext, partsContext } = this.validateContext(context);
      
      // Build consultation prompt for pump specialist using Council of 13 reasoning
      const prompt = this.buildCouncilPrompt(symptom, responses, siteContext, technicianContext, environmentalContext, safetyContext, partsContext);
      
      // Get council recommendation (Prismo orchestrates the Council of 13)
      const councilRecommendation = await this.prismo.delegate({
        task: 'diagnostic_enhancement',
        prompt,
        agents: ['PUMP_SPECIALIST'],
        context: {
          symptom,
          responses,
          siteContext,
          technicianContext,
          environmentalContext,
          safetyContext,
          partsContext
        }
      });
      
      // Have AutoMindLab format the final response according to enterprise standards
      const formattedResponse = await this.automindlab.process({
        rawInput: councilRecommendation,
        context: { 
          source: 'diagnostic_consultation',
          specialist: 'PUMP_SPECIALIST',
          councilVersion: '2.1.0'
        }
      });
      
      // Parse and structure the response according to standardized contract
      return this.parseResponse(formattedResponse, symptom);
    } catch (error) {
      console.error('Diagnostic consultation failed:', error);
      // Return structured fallback enhancement
      return this.getFallbackEnhancement(symptom, error.message);
    }
  }

  /**
   * Validate and normalize consultation context
   */
  validateContext(context) {
    // Ensure required fields exist with sensible defaults
    const validated = {
      symptom: context.symptom || 'unknown',
      responses: Array.isArray(context.responses) ? context.responses : [],
      siteContext: context.siteContext || {},
      technicianContext: context.technicianContext || {},
      environmentalContext: context.environmentalContext || {},
      safetyContext: context.safetyContext || {},
      partsContext: context.partsContext || {}
    };

    // Validate symptom is known
    const validSymptoms = [
      'lowPressure', 'pressureOscillation', 'highAmps', 'pumpCycling',
      'lagPumpNotEngaging', 'abnormalFrequencyBehavior', 
      'communicationTimeSyncAnomaly', 'generalPerformanceIssue'
    ];
    
    if (!validSymptoms.includes(validated.symptom)) {
      throw new Error(`Invalid symptom: ${validated.symptom}. Must be one of: ${validSymptoms.join(', ')}`);
    }

    return validated;
  }

  /**
   * Build consultation prompt for pump specialist using Council of 13 reasoning framework
   */
  buildCouncilPrompt(symptom, responses, siteContext, technicianContext, environmentalContext, safetyContext, partsContext) {
    return `
AUTOMINDIAGNOSTIC CONSULTATION REQUEST - PUMP SPECIALIST (Seat 7 of Council of 13)

PRIMARY SYMPTOM: ${this.formatSymptom(symptom)}

TECHNICIAN DIAGNOSTIC PATH COMPLETED:
${this.formatResponses(responses)}

SITE & STATION CONTEXT:
${this.formatSiteContext(siteContext)}

TECHNICIAN PROFILE:
${this.formatTechnicianContext(technicianContext)}

ENVIRONMENTAL FACTORS:
${this.formatEnvironmentalContext(environmentalContext)}

SAFETY CONSIDERATIONS:
${this.formatSafetyContext(safetyContext)}

PARTS & INVENTORY CONTEXT:
${this.formatPartsContext(partsContext)}

CONSULTATION REQUEST:
Apply your Pump Specialist expertise (drawing from Tesla, Einstein, Jung, Aurelius, Ross, Goggins, Curie, Turing, Franklin, and Carver) to provide:

1. RANKED PROBABLE CAUSES - List with confidence levels (high/medium/low) and supporting evidence
2. SPECIFIC NEXT CHECKS - Actionable measurements/inspections with tools, safety notes, and priority
3. PARTS TO CONSIDER - Specific components with compatibility notes and urgency indicators
4. ESCALATION CRITERIA - Clear, measurable indicators for when to escalate
5. CONTEXTUAL CLOSE-OUT NOTE - Suggested technical note for service record
6. ALTERNATIVE DIAGNOSTIC PATHS - Different approaches if current path isn't resolving
7. CONFIDENCE ASSESSMENT - Overall confidence in guidance given data quality
8. LIMITATIONS & ASSUMPTIONS - What we don't know or are assuming

FORMAT YOUR RESPONSE AS A STRUCTURED GUIDE THAT CAN BE PARSED BY AUTOMATED SYSTEMS.
USE CLEAR, ACTIONABLE LANGUAGE SUITABLE FOR FIELD TECHNICIANS.
WHEN UNCERTAIN, STATE SO EXPLICITLY AND RECOMMEND FIELD VERIFICATION.

Domain-specific guidance to consider:
- Low pressure: demand spikes, lag support, tuning, restriction, wear, controller limits
- Pressure oscillation: tuning stability, VFD behavior, sensing, valve instability, mechanical contributors  
- High amps: overload, restriction, binding, wear, phase imbalance, voltage quality, operating points
- Pump cycling: deadband, threshold logic, tank behavior, switch stability
- Lag pump not engaging: lag call verification, inhibit states, relay/wiring faults, settings
- Abnormal frequency: limit mismatch, noisy inputs, mode bounce, controller-state anomalies
- Communication/time sync: gateway health, network stability, controller drift, reference-clock issues

Always prioritize safety: never bypass LOTO, never claim mechanical confirmation without verification, never hide uncertainty.
`;
  }

  formatSymptom(symptom) {
    const symptomMap = {
      lowPressure: 'LOW PRESSURE - System pressure below setpoint',
      pressureOscillation: 'PRESSURE OSCILLATION - Unstable pressure fluctuations',
      highAmps: 'HIGH AMPS - Motor current above nameplate rating',
      pumpCycling: 'PUMP CYCLING - Excessive starting/stopping',
      lagPumpNotEngaging: 'LAG PUMP NOT ENGAGING - Backup pump fails to start when needed',
      abnormalFrequencyBehavior: 'ABNORMAL FREQUENCY - VFD/output frequency irregularities',
      communicationTimeSyncAnomaly: 'COMMUNICATION/TIME SYNC - Controller comms or clock issues',
      generalPerformanceIssue: 'GENERAL PERFORMANCE - Non-specific performance degradation'
    };
    return symptomMap[symptom] || symptom;
  }

  formatResponses(responses) {
    if (responses.length === 0) return 'No diagnostic steps completed yet.';
    return responses.map((r, i) => {
      const notes = r.notes ? ` (Notes: ${r.notes})` : '';
      return `${i+1}. ${r.prompt}: ${r.responseValue}${notes}`;
    }).join('\n');
  }

  formatSiteContext(context) {
    if (!context || Object.keys(context).length === 0) return 'No site context provided.';
    return Object.entries(context).map(([key, value]) => 
      `- ${this.capitalize(key)}: ${value}`
    ).join('\n');
  }

  formatTechnicianContext(context) {
    if (!context || Object.keys(context).length === 0) return 'No technician context provided.';
    return Object.entries(context).map(([key, value]) => 
      `- ${this.capitalize(key)}: ${value}`
    ).join('\n');
  }

  formatEnvironmentalContext(context) {
    if (!context || Object.keys(context).length === 0) return 'No environmental context provided.';
    return Object.entries(context).map(([key, value]) => 
      `- ${this.capitalize(key)}: ${value}`
    ).join('\n');
  }

  formatSafetyContext(context) {
    if (!context || Object.keys(context).length === 0) return 'No specific safety context provided (assume standard LOTO required).';
    return Object.entries(context).map(([key, value]) => 
      `- ${this.capitalize(key)}: ${value}`
    ).join('\n');
  }

  formatPartsContext(context) {
    if (!context || Object.keys(context).length === 0) return 'No parts/inventory context provided.';
    return Object.entries(context).map(([key, value]) => 
      `- ${this.capitalize(key)}: ${value}`
    ).join('\n');
  }

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Parse council/AutoMindLab response into structured enhancement per contract
   */
  parseResponse(response, originalSymptom) {
    // Extract structured data from the response
    const enhancement = {
      probableCauses: this.extractProbableCauses(response),
      nextChecks: this.extractNextChecks(response),
      partsToConsider: this.extractPartsToConsider(response),
      escalationCriteria: this.extractEscalationCriteria(response),
      closeOutNote: this.extractCloseOutNote(response),
      alternativePaths: this.extractAlternativePaths(response),
      metadata: this.extractMetadata(response, originalSymptom)
    };

    return enhancement;
  }

  extractProbableCauses(response) {
    // Extract causes with confidence levels
    const causes = [];
    
    // Look for numbered lists or bullet points with causes
    const causePatterns = [
      /(?:\d+\.|\*\s*|\-)\s*(.+?)(?:\s*\((confidence:?\s*(high|medium|low))\))?/gi,
      /(?:\*\*|\_\_)(.+?)(?:\*\*|\_\_)(?:\s*\((confidence:?\s*(high|medium|low))\))?/gi
    ];

    let match;
    for (const pattern of causePatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const causeText = match[1].trim();
        const confidence = match[2] || match[3] || 'medium';
        
        // Avoid duplicates and very short matches
        if (causeText.length > 10 && !causes.some(c => c.cause.toLowerCase() === causeText.toLowerCase())) {
          causes.push({
            cause: causeText,
            confidence: confidence.toLowerCase(),
            evidence: ['Council of 13 diagnostic reasoning']
          });
        }
      }
    }

    // If no structured causes found, extract from paragraphs
    if (causes.length === 0) {
      const paragraphs = response.split('\n\n').filter(p => p.trim().length > 20);
      paragraphs.slice(0, 3).forEach((p, index) => {
        const cleanCause = p.replace(/[^\w\s\-]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanCause.length > 15) {
          causes.push({
            cause: cleanCause.substring(0, 100) + '...',
            confidence: ['high', 'medium', 'low'][index % 3],
            evidence: ['Paragraph analysis']
          });
        }
      });
    }

    // Ensure we have at least some causes
    if (causes.length === 0) {
      causes.push({
        cause: 'Requires further investigation based on presented symptoms',
        confidence: 'low',
        evidence: ['Insufficient diagnostic data']
      });
    }

    return causes.slice(0, 5); // Top 5 causes
  }

  extractNextChecks(response) {
    const checks = [];
    
    // Look for action-oriented phrases
    const checkPatterns = [
      /(?:check|verify|measure|test|inspect|examine|monitor|observe)\s+([^.!?\n]+[.!?])/gi,
      /(?:\d+\.|\*\s*|\-)\s*(?:check|verify|measure|test|inspect|examine|monitor|observe)\s+([^.!?\n]+[.!?])/gi
    ];

    let match;
    for (const pattern of checkPatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const checkText = match[1].trim();
        if (checkText.length > 10 && !checks.some(c => c.action.toLowerCase() === checkText.toLowerCase())) {
          checks.push({
            action: checkText,
            tool: this.inferTool(checkText),
            safety: this.inferSafetyNote(checkText),
            priority: this.inferPriority(checkText)
          });
        }
      }
    }

    // Default checks if none found
    if (checks.length === 0) {
      checks.push({
        action: 'Verify measurements with calibrated equipment',
        tool: 'Calibrated pressure gauge and multimeter',
        safety: 'Standard LOTO procedures required',
        priority: 'high'
      });
      checks.push({
        action: 'Review service history and alert logs',
        tool: 'SCADA/HMI system',
        safety: 'Office safety - no field exposure',
        priority: 'medium'
      });
    }

    return checks.slice(0, 6); // Top 6 checks
  }

  inferTool(action) {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('pressure') || actionLower.includes('psi')) return 'Calibrated pressure gauge';
    if (actionLower.includes('amp') || actionLower.includes('current') || actionLower.includes('voltage')) return 'Clamp multimeter';
    if (actionLower.includes('flow')) return 'Flow meter';
    if (actionLower.includes('vibration')) return 'Vibration analyzer';
    if (actionLower.includes('temperature') || actionLower.includes('temp')) return 'Infrared thermometer';
    if (actionLower.includes('frequency') || actionLower.includes('hz')) return 'Frequency meter';
    if (actionLower.includes('inspect') || actionLower.includes('examine') || actionLower.includes('visual')) return 'Flashlight and inspection mirror';
    return 'Appropriate diagnostic tool';
  }

  inferSafetyNote(action) {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('electrical') || actionLower.includes('wire') || actionLower.includes('terminal') || 
        actionLower.includes('connection') || actionLower.includes('power')) {
      return 'Electrical PPE required, verify LOTO';
    }
    if (actionLower.includes('mechanical') || actionLower.includes('bearing') || actionLower.includes('shaft') || 
        actionLower.includes('impeller') || actionLower.includes('coupling')) {
      return 'Mechanical PPE required, verify machine isolation';
    }
    if (actionLower.includes('pressure') || actionLower.includes('psi') || actionLower.includes('flow')) {
      return 'Standard LOTO, pressure relief before disassembly';
    }
    return 'Standard PPE and safety procedures';
  }

  inferPriority(action) {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('immediate') || actionLower.includes('urgent') || actionLower.includes('critical') || 
        actionLower.includes('danger') || actionLower.includes('unsafe')) {
      return 'high';
    }
    if (actionLower.includes('check') || actionLower.includes('verify') || actionLower.includes('measure')) {
      return 'medium';
    }
    return 'low';
  }

  extractPartsToConsider(response) {
    const parts = [];
    
    // Look for part-related mentions
    const partPatterns = [
      /(?:check|replace|inspect)\s+(?:the\s+)?([a-zA-Z\s]+?)(?:\s+\([^)]*\)|\s+for|\s+if|\s+and|\s+or|\s*[.,;:])/gi,
      /(?:strainer|filter|seal|gasket|bearing|impeller|volute|check valve|pressure gauge|transducer|sensor|wire|cable|connector)\s+[a-zA-Z\s]*/gi
    ];

    let match;
    for (const pattern of partPatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const partText = match[0].trim();
        if (partText.length > 5 && partText.length < 50 && 
            !parts.some(p => p.part.toLowerCase() === partText.toLowerCase())) {
          parts.push({
            part: partText,
            reason: 'Identified during diagnostic reasoning',
            compatibility: 'Verify OEM specifications',
            urgency: 'medium'
          });
        }
      }
    }

    // Default parts if none found
    if (parts.length === 0) {
      parts.push({
        part: 'Pressure gauge (calibrated)',
        reason: 'Verification measurement',
        compatibility: 'Industry standard NPT connection',
        urgency: 'high'
      });
      parts.push({
        part: 'Suction strainer',
        reason: 'Common restriction point',
        compatibility: 'Verify pipe size and mesh rating',
        urgency: 'medium'
      });
    }

    return parts.slice(0, 5); // Top 5 parts
  }

  extractEscalationCriteria(response) {
    const criteria = [];
    
    // Look for escalation/threhold language
    const escalationPatterns = [
      /(?:if|when|should|must|ought to)\s+[^.!?]*?(?:escalate|call|notify|alert|refer)[^.!?]*[.!?]/gi,
      /(?:abnormal|exceed|above|below|more than|less than)\s+[^.!?]*?(?:psi|amp|hz|degree|inch|%)\s*[^.!?]*[.!?]/gi,
      /(?:persist|continue|remain|still)\s+[^.!?]*?(?:after|following|despite)\s+[^.!?]*[.!?]/gi
    ];

    let match;
    for (const pattern of escalationPatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const criteriaText = match[0].trim();
        if (criteriaText.length > 15 && 
            !criteria.some(c => c.condition.toLowerCase() === criteriaText.toLowerCase())) {
          criteria.push({
            condition: criteriaText,
            threshold: this.extractThreshold(criteriaText),
            action: this.extractEscalationAction(criteriaText),
            timeline: this.extractTimeline(criteriaText)
          });
        }
      }
    }

    // Default criteria if none found
    if (criteria.length === 0) {
      criteria.push({
        condition: 'Symptom persists after initial checks',
        threshold: '>15% deviation from setpoint',
        action: 'Escalate to senior technician or engineer',
        timeline: 'Within 30 minutes of initial assessment'
      });
      criteria.push({
        condition: 'Safety concern identified',
        threshold: 'Any LOTO violation or hazardous condition',
        action: 'Stop work and notify safety officer',
        timeline: 'Immediate'
      });
    }

    return criteria.slice(0, 4); // Top 4 criteria
  }

  extractThreshold(text) {
    const thresholdMatch = text.match(/(\d+(\.\d+)?)\s*([%°]|psi|amps?|hz|inches?|feet?|volts?|watts?)/i);
    return thresholdMatch ? thresholdMatch[0] : 'Not specified';
  }

  extractEscalationAction(text) {
    const actionMatch = text.match(/^(?:if|when|should|must|ought to)\s+([^.!?]+?)(?:\s+(?:if|when|above|below|more|less|persist|continue|remain|still))/i);
    return actionMatch ? actionMatch[1].trim() : 'Escalate per protocol';
  }

  extractTimeline(text) {
    const timeMatch = text.match(/(\d+\s*(?:second|minute|hour|day|week|month|sec|min|hr|day|wk|mo)s?)/i);
    return timeMatch ? timeMatch[0] : 'As soon as practicable';
  }

  extractCloseOutNote(response) {
    // Look for conclusion/summary language
    const notePatterns = [
      /(?:in summary|to summarize|consequently|therefore|as a result|close.*out.*note|service note).*?[.!?]/gi,
      /(?:the\s+issue\s+was|root\s+cause\s+appears\s+to\s+be|diagnosis\s+indicates).*?[.!?]/gi
    ];

    let match;
    for (const pattern of notePatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const noteText = match[0].trim();
        if (noteText.length > 20 && noteText.length < 200) {
          // Clean up the note
          const cleanNote = noteText
            .replace(/^(in summary|to summarize|consequently|therefore|as a result|close.*out.*note|service note):?\s*/i, '')
            .replace(/[.!?]+$/, '.');
          return cleanNote.charAt(0).toUpperCase() + cleanNote.slice(1);
        }
      }
    }

    // Generate from probable causes if no explicit note found
    const causes = this.extractProbableCauses(response);
    if (causes.length > 0) {
      return `Diagnostic enhanced with AutoMindLab Pump Specialist guidance. Primary consideration: ${causes[0].cause}. Verified through structured council reasoning.`;
    }

    return 'Diagnostic consultation completed via AutoMindLab Pump Specialist. Standard procedures followed.';
  }

  extractAlternativePaths(response) {
    const paths = [];
    
    // Look for alternative/conditional language
    const altPatterns = [
      /(?:alternatively|instead|or|if not|if then|otherwise|either)\s+[^.!?]*[.!?]/gi,
      /(?:consider|try|attempt|explore)\s+[^.!?]*[.!?]/gi,
      /(?:if.*?pressure.*?normal|if.*?amps.*?okay|if.*?frequency.*?stable)\s+[^.!?]*[.!?]/gi
    ];

    let match;
    for (const pattern of altPatterns) {
      while ((match = pattern.exec(response)) !== null) {
        const pathText = match[0].trim();
        if (pathText.length > 15 && pathText.length < 150 && 
            !paths.some(p => p.description.toLowerCase() === pathText.toLowerCase())) {
          paths.push({
            name: this.generatePathName(pathText),
            description: pathText,
            trigger: this.extractPathTrigger(pathText)
          });
        }
      }
    }

    // Default alternatives if none found
    if (paths.length === 0) {
      paths.push({
        name: 'Suction-Side Investigation',
        description: 'If pressure normal but flow low: check for suction-side restrictions, strainer condition, and suction pressure',
        trigger: 'Pressure measurements within normal range but flow below expected'
      });
      paths.push({
        name: 'Electrical Deep Dive', 
        description: 'If mechanical checks normal: proceed with detailed electrical inspection including voltage quality, phase balance, and insulation testing',
        trigger: 'All mechanical inspections show normal operation'
      });
      paths.push({
        name: 'System Curve Analysis',
        description: 'If issue persists: compare actual system curve to design curve to identify hidden restrictions or demand changes',
        trigger: 'Multiple mechanical and electrical checks inconclusive'
      });
    }

    return paths.slice(0, 4); // Top 4 alternatives
  }

  generatePathName(description) {
    const descLower = description.toLowerCase();
    if (descLower.includes('suction') || descLower.includes('inlet')) return 'Suction-Side Investigation';
    if (descLower.includes('electrical') || descLower.includes('voltage') || descLower.includes('phase')) return 'Electrical Deep Dive';
    if (descLower.includes('system curve') || descLower.includes('design curve')) return 'System Curve Analysis';
    if (descLower.includes('vibration') || descLower.includes('balance')) return 'Vibration Analysis';
    if (descLower.includes('temperature') || descLower.includes('thermal')) return 'Thermal Imaging Survey';
    if (descLower.includes('control') || descLower.includes('tuning') || descLower.includes('pid')) return 'Control Loop Review';
    return 'Alternative Diagnostic Path';
  }

  extractPathTrigger(description) {
    const descLower = description.toLowerCase();
    if (descLower.includes('if') || descLower.includes('when')) {
      const triggerMatch = description.match(/(?:if|when)\s+([^:]+?)(?::|then|\.|$)/i);
      return triggerMatch ? triggerMatch[1].trim() : 'Condition not specified';
    }
    return 'Standard diagnostic flow completion';
  }

  extractMetadata(response, originalSymptom) {
    // Assess confidence based on response quality and specificity
    let confidence = 'medium';
    const limitations = [];
    const dataQuality = 'good';

    // Check for uncertainty indicators
    const uncertaintyIndicators = [
      'unclear', 'uncertain', 'possibly', 'maybe', 'might', 'could be', 
      'appears to', 'suggests', 'indicates', 'likely', 'probable'
    ];
    const certaintyIndicators = [
      'definitely', 'confirmed', 'verified', 'certain', 'certainly', 
      'without doubt', 'clearly', 'obviously', 'evident'
    ];

    const uncertaintyCount = uncertaintyIndicators.reduce((count, word) => 
      count + (response.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
    const certaintyCount = certaintyIndicators.reduce((count, word) => 
      count + (response.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);

    if (uncertaintyCount > certaintyCount + 2) {
      confidence = 'low';
      limitations.push('High uncertainty in diagnostic reasoning');
    } else if (certaintyCount > uncertaintyCount) {
      confidence = 'high';
    } else {
      confidence = 'medium';
    }

    // Check for missing data indicators
    const missingDataIndicators = [
      'missing data', 'no data', 'insufficient information', 
      'more data needed', 'additional information required'
    ];
    const missingDataCount = missingDataIndicators.reduce((count, phrase) => 
      count + (response.toLowerCase().includes(phrase) ? 1 : 0), 0);
    
    if (missingDataCount > 0) {
      limitations.push('Limited diagnostic data available');
      if (missingDataCount >= 2) dataQuality = 'poor';
      else if (missingDataCount === 1) dataQuality = 'fair';
    }

    // Check for specificity
    const specificIndicators = [
      'psi', 'amp', 'hz', 'volt', 'degree', 'inch', 'foot', 
      'specific', 'exact', 'precise', 'measured', 'reading'
    ];
    const specificityCount = specificIndicators.reduce((count, word) => 
      count + (response.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);

    if (specificityCount < 3) {
      limitations.push('Limited quantitative data in reasoning');
      if (dataQuality === 'good') dataQuality = 'fair';
    }

    // Generate consultation ID
    const consultationId = `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      confidence,
      timestamp: new Date().toISOString(),
      consultationId,
      dataQuality,
      limitations: limitations.length > 0 ? limitations : ['No significant limitations identified'],
      originalSymptom: originalSymptom
    };
  }

  getFallbackEnhancement(symptom, errorMessage) {
    return {
      probableCauses: [
        { 
          cause: 'Diagnostic consultation service unavailable - requires manual technician review', 
          confidence: 'low', 
          evidence: ['Service error: ' + errorMessage] 
        }
      ],
      nextChecks: [
        {
          action: 'Verify all measurements with calibrated equipment',
          tool: 'Calibrated pressure gauge, multimeter, and flow meter',
          safety: 'Standard LOTO and PPE required',
          priority: 'high'
        },
        {
          action: 'Review complete service history and alert logs',
          tool: 'SCADA/HMI system',
          safety: 'Office safety',
          priority: 'medium'
        },
        {
          action: 'Consult senior technician or engineer',
          tool: 'Phone or radio communication',
          safety: 'Standard safety procedures',
          priority: 'medium'
        }
      ],
      partsToConsider: [
        { 
          part: 'Complete diagnostic kit', 
          reason: 'Enables thorough field verification', 
          compatibility: 'Standard technician tools', 
          urgency: 'medium' 
        }
      ],
      escalationCriteria: [
        {
          condition: 'Unable to complete diagnostic safely',
          threshold: 'Any safety concern identified',
          action: 'Stop work and notify supervisor',
          timeline: 'Immediate'
        },
        {
          condition: 'Symptom not resolved after standard procedures',
          threshold: '>20% deviation from acceptable parameters',
          action: 'Escalate to senior specialist or engineer',
          timeline: 'Within 60 minutes'
        }
      ],
      closeOutNote: 'Diagnostic consultation service unavailable. Technician performed standard procedures with manual review.',
      alternativePaths: [
        {
          name: 'Manual Expert Review',
          description: 'Escalate to senior technician for expert judgment when automated consultation unavailable',
          trigger: 'Consultation service failure or unavailable'
        }
      ],
      metadata: {
        confidence: 'low',
        timestamp: new Date().toISOString(),
        consultationId: `fallback_${Date.now()}`,
        dataQuality: 'poor',
        limitations: ['Consultation service unavailable', errorMessage],
        originalSymptom: symptom
      }
    };
  }
}

module.exports = DiagnosticConsultationService;
