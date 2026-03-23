import 'dart:convert';
import 'package:http/http.dart' as http;
import '../features/diagnostics/diagnostics_feature.dart';

class DiagnosticConsultationService {
  final String baseUrl;
  final Duration timeout;

  DiagnosticConsultationService({
    this.baseUrl = 'http://10.0.2.2:3001', // localhost for Android emulator
    this.timeout = const Duration(seconds: 10),
  });

  Future<DiagnosticEnhancement> consult({
    required DiagnosticSymptom symptom,
    required List<DiagnosticStepResponse> responses,
    Map<String, dynamic>? siteContext,
    Map<String, dynamic>? technicianContext,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/api/diagnose');
      final requestBody = {
        'symptom': symptom.name,
        'responses': responses.map((r) => r.toJson()).toList(),
        'siteContext': siteContext ?? {},
        'technicianContext': technicianContext ?? {},
      };

      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestBody),
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return DiagnosticEnhancement.fromJson(jsonResponse);
      } else {
        throw Exception('Server returned ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      // Return fallback enhancement on failure
      return DiagnosticEnhancement.getFallback(symptom);
    }
  }
}

class DiagnosticEnhancement {
  final List<ProbableCause> probableCauses;
  final List<String> nextChecks;
  final List<PartRecommendation> partsToConsider;
  final List<String> escalationCriteria;
  final String closeOutNote;
  final List<String> alternativePaths;
  final String confidence;
  final String timestamp;

  DiagnosticEnhancement({
    required this.probableCauses,
    required this.nextChecks,
    required this.partsToConsider,
    required this.escalationCriteria,
    required this.closeOutNote,
    required this.alternativePaths,
    required this.confidence,
    required this.timestamp,
  });

  factory DiagnosticEnhancement.fromJson(Map<String, dynamic> json) {
    return DiagnosticEnhancement(
      probableCauses: (json['probableCauses'] as List?)
              ?.map((e) => ProbableCause.fromJson(e))
              .toList() ?? [],
      nextChecks: List<String>.from(json['nextChecks'] ?? []),
      partsToConsider: (json['partsToConsider'] as List?)
              ?.map((e) => PartRecommendation.fromJson(e))
              .toList() ?? [],
      escalationCriteria: List<String>.from(json['escalationCriteria'] ?? []),
      closeOutNote: json['closeOutNote'] ?? '',
      alternativePaths: List<String>.from(json['alternativePaths'] ?? []),
      confidence: json['confidence'] ?? 'low',
      timestamp: json['timestamp'] ?? DateTime.now().toISOString(),
    );
  }

  factory DiagnosticEnhancement.getFallback(DiagnosticSymptom symptom) {
    return DiagnosticEnhancement(
      probableCauses: [
        ProbableCause(cause: 'Requires further investigation', confidence: 'low')
      ],
      nextChecks: [
        'Verify measurements with calibrated equipment',
        'Review service history'
      ],
      partsToConsider: [],
      escalationCriteria: [
        'Unable to verify measurements safely'
      ],
      closeOutNote: 'Basic diagnostic completed. Recommend escalation for specialist review.',
      alternativePaths: [
        'Consider manufacturer-specific diagnostic procedures'
      ],
      confidence: 'low',
      timestamp: DateTime.now().toISOString(),
    );
  }
}

class ProbableCause {
  final String cause;
  final String confidence;

  ProbableCause({required this.cause, required this.confidence});

  factory ProbableCause.fromJson(Map<String, dynamic> json) {
    return ProbableCause(
      cause: json['cause'] ?? '',
      confidence: json['confidence'] ?? 'low',
    );
  }
}

class PartRecommendation {
  final String part;
  final String reason;

  PartRecommendation({required this.part, required this.reason});

  factory PartRecommendation.fromJson(Map<String, dynamic> json) {
    return PartRecommendation(
      part: json['part'] ?? '',
      reason: json['reason'] ?? '',
    );
  }
}

// Extension to convert DiagnosticStepResponse to JSON
extension DiagnosticStepResponseExtension on DiagnosticStepResponse {
  Map<String, dynamic> toJson() {
    return {
      'stepKey': stepKey,
      'prompt': prompt,
      'responseValue': responseValue,
      'notes': notes,
    };
  }
}