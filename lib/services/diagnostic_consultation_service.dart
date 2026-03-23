import 'dart:convert';

import 'package:http/http.dart' as http;

class DiagnosticConsultationService {
  DiagnosticConsultationService({
    required this.baseUrl,
    this.timeout = const Duration(seconds: 10),
  });

  final String baseUrl;
  final Duration timeout;

  Future<DiagnosticEnhancement> consult(DiagnosticConsultationRequest request) async {
    final uri = Uri.parse('$baseUrl/api/diagnose');

    try {
      final response = await http
          .post(
            uri,
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode(request.toJson()),
          )
          .timeout(timeout);

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw Exception('Diagnostic consultation failed: ${response.statusCode} ${response.body}');
      }

      final decoded = jsonDecode(response.body);
      if (decoded is! Map<String, dynamic>) {
        throw Exception('Diagnostic consultation returned invalid JSON.');
      }

      return DiagnosticEnhancement.fromJson(decoded);
    } catch (_) {
      return DiagnosticEnhancement.fallback(request.symptom);
    }
  }
}

class DiagnosticConsultationRequest {
  const DiagnosticConsultationRequest({
    required this.symptom,
    required this.responses,
    this.siteContext = const <String, dynamic>{},
    this.technicianContext = const <String, dynamic>{},
  });

  final String symptom;
  final List<DiagnosticResponseItem> responses;
  final Map<String, dynamic> siteContext;
  final Map<String, dynamic> technicianContext;

  Map<String, dynamic> toJson() {
    return {
      'symptom': symptom,
      'responses': responses.map((item) => item.toJson()).toList(),
      'siteContext': siteContext,
      'technicianContext': technicianContext,
    };
  }
}

class DiagnosticResponseItem {
  const DiagnosticResponseItem({
    required this.stepKey,
    required this.prompt,
    required this.responseValue,
    this.notes,
  });

  final String stepKey;
  final String prompt;
  final String responseValue;
  final String? notes;

  Map<String, dynamic> toJson() {
    return {
      'stepKey': stepKey,
      'prompt': prompt,
      'responseValue': responseValue,
      if (notes != null) 'notes': notes,
    };
  }
}

class DiagnosticEnhancement {
  const DiagnosticEnhancement({
    required this.symptom,
    required this.councilSeatsConsulted,
    required this.probableCauses,
    required this.nextChecks,
    required this.partsToConsider,
    required this.escalationCriteria,
    required this.closeOutNote,
    required this.alternativePaths,
    required this.confidence,
    required this.runtimeNotes,
    required this.warnings,
    required this.timestamp,
  });

  final String symptom;
  final List<String> councilSeatsConsulted;
  final List<ProbableCause> probableCauses;
  final List<String> nextChecks;
  final List<PartRecommendation> partsToConsider;
  final List<String> escalationCriteria;
  final String closeOutNote;
  final List<String> alternativePaths;
  final String confidence;
  final List<String> runtimeNotes;
  final List<String> warnings;
  final String timestamp;

  factory DiagnosticEnhancement.fromJson(Map<String, dynamic> json) {
    return DiagnosticEnhancement(
      symptom: json['symptom']?.toString() ?? 'general_performance_issue',
      councilSeatsConsulted: (json['councilSeatsConsulted'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      probableCauses: (json['probableCauses'] as List<dynamic>? ?? const <dynamic>[])
          .whereType<Map<String, dynamic>>()
          .map(ProbableCause.fromJson)
          .toList(),
      nextChecks: (json['nextChecks'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      partsToConsider: (json['partsToConsider'] as List<dynamic>? ?? const <dynamic>[])
          .whereType<Map<String, dynamic>>()
          .map(PartRecommendation.fromJson)
          .toList(),
      escalationCriteria: (json['escalationCriteria'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      closeOutNote: json['closeOutNote']?.toString() ?? '',
      alternativePaths: (json['alternativePaths'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      confidence: json['confidence']?.toString() ?? 'low',
      runtimeNotes: (json['runtimeNotes'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      warnings: (json['warnings'] as List<dynamic>? ?? const <dynamic>[])
          .map((item) => item.toString())
          .toList(),
      timestamp: json['timestamp']?.toString() ?? DateTime.now().toIso8601String(),
    );
  }

  factory DiagnosticEnhancement.fallback(String symptom) {
    return DiagnosticEnhancement(
      symptom: symptom,
      councilSeatsConsulted: const <String>[],
      probableCauses: const <ProbableCause>[
        ProbableCause(cause: 'Requires further investigation', confidence: 'low'),
      ],
      nextChecks: const <String>[
        'Verify measurements with calibrated equipment.',
        'Review recent service history.',
      ],
      partsToConsider: const <PartRecommendation>[],
      escalationCriteria: const <String>[
        'Escalate if measurements cannot be safely validated in the field.',
      ],
      closeOutNote: 'Basic diagnostic consultation fallback used. Recommend specialist review if uncertainty remains.',
      alternativePaths: const <String>[
        'Use manufacturer-specific procedures if site evidence remains inconclusive.',
      ],
      confidence: 'low',
      runtimeNotes: const <String>[],
      warnings: const <String>['Consultation service was unavailable; fallback guidance returned.'],
      timestamp: DateTime.now().toIso8601String(),
    );
  }
}

class ProbableCause {
  const ProbableCause({
    required this.cause,
    required this.confidence,
  });

  final String cause;
  final String confidence;

  factory ProbableCause.fromJson(Map<String, dynamic> json) {
    return ProbableCause(
      cause: json['cause']?.toString() ?? '',
      confidence: json['confidence']?.toString() ?? 'low',
    );
  }
}

class PartRecommendation {
  const PartRecommendation({
    required this.part,
    required this.reason,
  });

  final String part;
  final String reason;

  factory PartRecommendation.fromJson(Map<String, dynamic> json) {
    return PartRecommendation(
      part: json['part']?.toString() ?? '',
      reason: json['reason']?.toString() ?? '',
    );
  }
}
