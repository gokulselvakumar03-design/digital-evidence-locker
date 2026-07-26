/**
 * AI Gateway Module Interface Definitions
 * Path: server/src/modules/ai/ai.interface.ts
 * Purpose: Interfaces for AI job status and analysis payloads.
 */

export interface IAIAnalysisResult {
  id: string;
  evidenceId: string;
  type: 'TRANSCRIPTION' | 'OCR' | 'SUMMARY' | 'ENTITY_EXTRACTION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: any;
  errorMessage?: string | null;
  createdAt: Date;
}
