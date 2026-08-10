import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../../features/auth/authApi.js';
import AuthCard from '../../components/auth/AuthCard.jsx';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await resetPassword({ token, password }).unwrap();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err?.data?.message || 'This reset link is invalid or has expired.');
    }
  }

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={6}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          RESET PASSWORD
        </button>
        <Link to="/login" className="text-center text-sm text-gray-600 hover:text-brand-500">
          Back to Login
        </Link>
      </form>
    </AuthCard>
  );
}
