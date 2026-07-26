import { TranscribeRequestDto, OcrRequestDto, SummarizeCaseDto } from './ai.dto.js';
import { IAIAnalysisResult } from './ai.interface.js';

/**
 * AI Gateway Business Service
 * Path: server/src/modules/ai/ai.service.ts
 * Purpose: Connects Express backend to FastAPI AI microservice for Whisper, EasyOCR, and Gemini.
 */
export class AIService {
  async requestTranscription(_dto: TranscribeRequestDto): Promise<IAIAnalysisResult> {
    // Developer Stub: Proxy request to FastAPI ai-service /transcribe
    return {} as IAIAnalysisResult;
  }

  async requestOcr(_dto: OcrRequestDto): Promise<IAIAnalysisResult> {
    // Developer Stub: Proxy request to FastAPI ai-service /ocr
    return {} as IAIAnalysisResult;
  }

  async requestCaseSummary(_dto: SummarizeCaseDto): Promise<IAIAnalysisResult> {
    // Developer Stub: Proxy request to FastAPI ai-service /summarize
    return {} as IAIAnalysisResult;
  }
}

export const aiService = new AIService();
