export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
    </div>
  );
};
