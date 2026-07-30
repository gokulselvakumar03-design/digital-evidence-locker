import { Card } from '../ui/Card';
import type { AIAnalysis } from '../../types';

interface AIAnalysisPanelProps {
  analysis: AIAnalysis;
}

export const AIAnalysisPanel = ({ analysis }: AIAnalysisPanelProps) => {
  return (
    <Card title="AI Analysis" description="Structured placeholder results for future API responses.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">OCR Result</p>
          <p className="mt-2 text-sm text-slate-600">{analysis.ocrResult}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Speech Transcript</p>
          <p className="mt-2 text-sm text-slate-600">{analysis.speechTranscript}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Evidence Category</p>
          <p className="mt-2 text-sm text-slate-600">{analysis.category}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">AI Summary</p>
          <p className="mt-2 text-sm text-slate-600">{analysis.summary}</p>
        </div>
      </div>
    </Card>
  );
};
