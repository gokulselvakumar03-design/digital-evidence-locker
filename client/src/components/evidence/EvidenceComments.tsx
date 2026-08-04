import { Card } from '../ui/Card';
import type { CommentItem } from '../../types';

interface EvidenceCommentsProps {
  comments: CommentItem[];
}

export const EvidenceComments = ({ comments }: EvidenceCommentsProps) => {
  return (
    <Card title="Comments" description="Mock collaboration thread for future review workflows.">
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{comment.author}</p>
              <span className="text-sm text-slate-400">{comment.timestamp}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{comment.message}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{comment.role}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Add Comment</span>
          <textarea rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Add a mock collaboration note..." />
        </label>
      </div>
    </Card>
  );
};
