/**
 * AI Gateway Data Transfer Objects (DTOs)
 * Path: server/src/modules/ai/ai.dto.ts
 * Purpose: Request payloads for requesting Whisper, EasyOCR, and Gemini analysis.
 */

export interface TranscribeRequestDto {
  evidenceId: string;
}

export interface OcrRequestDto {
  evidenceId: string;
}

export interface SummarizeCaseDto {
  caseId: string;
}
