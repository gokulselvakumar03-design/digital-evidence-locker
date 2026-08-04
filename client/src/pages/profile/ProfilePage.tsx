import { useMemo, useState } from 'react';
import { Camera, CheckCircle2, KeyRound, Mail, MapPin, PencilLine, Phone, ShieldCheck, ShieldOff, UserRound, Users } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationSettings } from '../../components/notifications/NotificationSettings';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { mockNotificationPreferences, mockPrivacySettings, mockProfile, mockProfileActivity, mockProfileSessions, mockProfileSettings } from '../../data/mockData';

const initialForm = {
  firstName: mockProfile.firstName,
  lastName: mockProfile.lastName,
  email: mockProfile.email,
  phone: mockProfile.phone,
  department: mockProfile.department,
  organization: mockProfile.organization,
  address: mockProfile.address,
  bio: mockProfile.bio,
};

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    ...mockProfile,
    firstName: user?.firstName ?? mockProfile.firstName,
    lastName: user?.lastName ?? mockProfile.lastName,
    email: user?.email ?? mockProfile.email,
    role: user?.role ?? mockProfile.role,
  });
  const [formValues, setFormValues] = useState(initialForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fullName = useMemo(() => `${profile.firstName} ${profile.lastName}`.trim(), [profile.firstName, profile.lastName]);

  const handleProfileFieldChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
    setProfileErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!formValues.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!formValues.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!formValues.department.trim()) nextErrors.department = 'Department is required.';
    if (!formValues.organization.trim()) nextErrors.organization = 'Organization is required.';
    if (formValues.phone.trim() && !/^\+?[0-9\s()-.]{7,}$/.test(formValues.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';

    if (Object.keys(nextErrors).length > 0) {
      setProfileErrors(nextErrors);
      return;
    }

    setProfile((previous) => ({
      ...previous,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      department: formValues.department,
      organization: formValues.organization,
      address: formValues.address,
      bio: formValues.bio,
    }));
    setIsEditing(false);
  };

  const handlePasswordFieldChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm((previous) => ({ ...previous, [field]: value }));
    setPasswordErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (passwordForm.currentPassword.length < 8) nextErrors.currentPassword = 'Current password is required.';
    if (passwordForm.newPassword.length < 8) nextErrors.newPassword = 'Password must be at least 8 characters.';
    if (passwordForm.confirmPassword !== passwordForm.newPassword) nextErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return;
    }

    setPasswordForm(initialPasswordForm);
    setPasswordErrors({});
    setShowPasswordForm(false);
  };

  return (
    <AppLayout title="Profile">
      <PageHeader
        title="Profile & settings"
        description="Manage your legal workflow identity, access, and preferences."
        action={<Button variant="secondary" onClick={() => setIsEditing(true)}><PencilLine size={16} className="mr-2" />Edit Profile</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img src={profile.profileImage} alt={fullName} className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-100" />
              <button type="button" className="absolute -bottom-1 -right-1 rounded-full border border-slate-200 bg-white p-2 text-indigo-600 shadow-sm">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">{fullName}</h2>
            <p className="text-sm text-slate-500">{profile.role}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge tone="indigo">{profile.department}</Badge>
              <Badge tone="slate">{profile.organization}</Badge>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Mail size={16} className="mt-0.5 text-slate-500" />
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-slate-800">{profile.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Phone size={16} className="mt-0.5 text-slate-500" />
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-medium text-slate-800">{profile.phone}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Users size={16} className="mt-0.5 text-slate-500" />
              <div>
                <dt className="text-slate-400">Organization</dt>
                <dd className="font-medium text-slate-800">{profile.organization}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <UserRound size={16} className="mt-0.5 text-slate-500" />
              <div>
                <dt className="text-slate-400">Employee ID</dt>
                <dd className="font-medium text-slate-800">{profile.employeeId}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <MapPin size={16} className="mt-0.5 text-slate-500" />
              <div>
                <dt className="text-slate-400">Address</dt>
                <dd className="font-medium text-slate-800">{profile.address}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            <Button variant="secondary" onClick={() => setShowPasswordForm(true)}>Change Password</Button>
            <Button variant="secondary" onClick={() => setShowPasswordForm(false)}>Security Settings</Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Account overview" description="Identity and access snapshot for your legal operations profile.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Member Since</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile.memberSince}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last Login</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile.lastLogin}</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <div className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} /> Account status is active and verified.</div>
            </div>
          </Card>

          <Card title="About" description="Professional summary and role context.">
            <p className="text-sm leading-6 text-slate-700">{profile.bio}</p>
          </Card>
        </div>
      </div>

      {isEditing ? (
        <Card title="Edit profile" description="Update your organization profile and public details." className="mt-6">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">First Name</label>
                <input value={formValues.firstName} onChange={(event) => handleProfileFieldChange('firstName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.firstName ? <p className="mt-1 text-xs text-rose-600">{profileErrors.firstName}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
                <input value={formValues.lastName} onChange={(event) => handleProfileFieldChange('lastName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.lastName ? <p className="mt-1 text-xs text-rose-600">{profileErrors.lastName}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={formValues.email} onChange={(event) => handleProfileFieldChange('email', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.email ? <p className="mt-1 text-xs text-rose-600">{profileErrors.email}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input value={formValues.phone} onChange={(event) => handleProfileFieldChange('phone', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.phone ? <p className="mt-1 text-xs text-rose-600">{profileErrors.phone}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <input value={formValues.department} onChange={(event) => handleProfileFieldChange('department', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.department ? <p className="mt-1 text-xs text-rose-600">{profileErrors.department}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Organization</label>
                <input value={formValues.organization} onChange={(event) => handleProfileFieldChange('organization', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                {profileErrors.organization ? <p className="mt-1 text-xs text-rose-600">{profileErrors.organization}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <textarea value={formValues.address} onChange={(event) => handleProfileFieldChange('address', event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
              <textarea value={formValues.bio} onChange={(event) => handleProfileFieldChange('bio', event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Profile Picture Upload</p>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-500">No file selected</span>
                <Button type="button" variant="secondary">Choose Image</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setProfileErrors({}); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Account settings" description="Default workspace and presentation preferences.">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Language</span>
                <select defaultValue={mockProfileSettings.language} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Timezone</span>
                <select defaultValue={mockProfileSettings.timezone} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>Pacific Time (UTC-8)</option>
                  <option>Eastern Time (UTC-5)</option>
                  <option>GMT (UTC+0)</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Date Format</span>
                <select defaultValue={mockProfileSettings.dateFormat} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Theme</span>
                <select defaultValue={mockProfileSettings.theme} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Dashboard Preferences</span>
                <select defaultValue={mockProfileSettings.dashboardPreferences} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>Executive Overview</option>
                  <option>Investigation Queue</option>
                  <option>Evidence Review</option>
                </select>
              </label>
              <label className="text-sm text-slate-700">
                <span className="mb-2 block font-medium">Default Landing Page</span>
                <select defaultValue={mockProfileSettings.defaultLandingPage} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>Dashboard</option>
                  <option>Cases</option>
                  <option>Evidence</option>
                  <option>Timeline</option>
                </select>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Security" description="Password, access, and trust controls for your account.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">Password</p>
                <p className="text-sm text-slate-500">Last changed 34 days ago</p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <Button variant="secondary" onClick={() => setShowPasswordForm(true)}><KeyRound size={15} className="mr-2" />Change Password</Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">Two Factor Authentication</p>
                <p className="text-sm text-slate-500">Authenticator app enabled</p>
              </div>
              <Button variant="secondary">Enable 2FA</Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">Login Sessions</p>
                <p className="text-sm text-slate-500">3 active devices</p>
              </div>
              <Button variant="secondary">View Sessions</Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">Recovery Email</p>
                <p className="text-sm text-slate-500">alex.morgan@backuplegal.io</p>
              </div>
              <Button variant="secondary">Update</Button>
            </div>
          </div>
        </Card>
      </div>

      {showPasswordForm ? (
        <Card title="Change password" description="Update your account credentials securely." className="mt-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(event) => handlePasswordFieldChange('currentPassword', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              {passwordErrors.currentPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.currentPassword}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(event) => handlePasswordFieldChange('newPassword', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              {passwordErrors.newPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.newPassword}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(event) => handlePasswordFieldChange('confirmPassword', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              {passwordErrors.confirmPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.confirmPassword}</p> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save Password</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowPasswordForm(false); setPasswordErrors({}); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Active sessions" description="Review recent devices and manage your signed-in access.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Device</th>
                  <th className="pb-3 pr-4 font-medium">Browser</th>
                  <th className="pb-3 pr-4 font-medium">OS</th>
                  <th className="pb-3 pr-4 font-medium">IP Address</th>
                  <th className="pb-3 pr-4 font-medium">Location</th>
                  <th className="pb-3 pr-4 font-medium">Last Active</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockProfileSessions.map((session) => (
                  <tr key={session.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-900">{session.device}</div>
                      {session.current ? <div className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Current Session</div> : null}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{session.browser}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.os}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.ipAddress}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.location}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.lastActive}</td>
                    <td className="py-3"><button type="button" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Logout</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary">Logout Session</Button>
            <Button variant="secondary">Logout All</Button>
          </div>
        </Card>

        <Card title="Activity history" description="Recent user actions across the legal workflow platform.">
          <div className="space-y-3">
            {mockProfileActivity.map((entry) => (
              <div key={entry.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><ShieldCheck size={16} /></div>
                <div>
                  <p className="font-medium text-slate-900">{entry.title}</p>
                  <p className="text-sm text-slate-600">{entry.detail}</p>
                  <p className="mt-1 text-xs text-slate-400">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Notification preferences" description="Choose how you receive legal workflow updates.">
          <NotificationSettings toggles={mockNotificationPreferences} />
        </Card>

        <Card title="Privacy settings" description="Configure how your profile and activity are shared.">
          <div className="space-y-4">
            {Object.entries(mockPrivacySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium capitalize text-slate-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
                <button type="button" className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-indigo-600' : 'bg-slate-200'}`} aria-label={`Toggle ${key}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <div className="flex items-center gap-2 font-medium"><ShieldOff size={16} /> Delete account is disabled for this workspace.</div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
