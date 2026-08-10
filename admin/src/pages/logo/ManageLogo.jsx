import { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateLogoMutation } from '../../features/settings/settingsApi.js';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function ManageLogo() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateLogo, { isLoading: saving }] = useUpdateLogoMutation();
  const [logo, setLogo] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    if (settings) setLogo(settings.logo);
  }, [settings]);

  async function handleSave() {
    try {
      await updateLogo(logo).unwrap();
      showToast('Logo updated', 'success');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update logo', 'error');
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Manage Logo</h1>
      <ImageUploader value={logo} onChange={setLogo} folder="logo" />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        SAVE LOGO
      </button>
    </div>
  );
}
