import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials } from '../../features/auth/authSlice.js';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../../features/user/userApi.js';
import Modal from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const showToast = useToast();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  const [form, setForm] = useState({ name: '', countryCode: '+91', phone: '' });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', countryCode: user.countryCode || '+91', phone: user.phone || '' });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await updateProfile(form).unwrap();
      dispatch(setCredentials({ user: result.data.user, accessToken: null }));
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update profile', 'error');
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    try {
      await changePassword(passwordForm).unwrap();
      showToast('Password updated', 'success');
      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err?.data?.message || 'Failed to change password', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
        <button
          type="button"
          onClick={() => setPasswordModalOpen(true)}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          CHANGE PASSWORD
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-gray-700">Full Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-gray-700">Email</span>
          <input value={user?.email || ''} disabled className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-400" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2 sm:max-w-xs">
          <span className="font-medium text-gray-700">Phone</span>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
              className="rounded-lg border border-gray-300 px-2 py-2.5"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-500"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="self-start rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60 sm:col-span-2"
        >
          UPDATE PROFILE
        </button>
      </form>

      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            Save Password
          </button>
        </form>
      </Modal>
    </div>
  );
}
