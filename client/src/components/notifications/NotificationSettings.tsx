import { useState } from 'react';

interface NotificationSettingsProps {
  toggles?: Record<string, boolean>;
}

const defaultToggles = {
  caseUpdates: true,
  evidenceUploads: true,
  securityAlerts: true,
  aiAnalysis: true,
  emailNotifications: false,
  pushNotifications: true,
  desktopNotifications: true,
};

export const NotificationSettings = ({ toggles = defaultToggles }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState(toggles);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="font-medium capitalize text-slate-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle(key as keyof typeof settings)}
            className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-indigo-600' : 'bg-slate-200'}`}
            aria-label={`Toggle ${key}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      ))}
    </div>
  );
};
