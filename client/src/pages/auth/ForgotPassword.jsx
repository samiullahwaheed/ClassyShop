import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../features/auth/authApi.js';
import AuthCard from '../../components/auth/AuthCard.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    await forgotPassword({ email }).unwrap();
    setSent(true);
  }

  return (
    <AuthCard title="Reset your password">
      {sent ? (
        <p className="text-center text-sm text-gray-600">
          If that email is registered, we've sent a password reset link to it.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">Enter your account email and we'll send you a reset link.</p>
          <input
            type="email"
            required
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            SEND RESET LINK
          </button>
          <Link to="/login" className="text-center text-sm text-gray-600 hover:text-brand-500">
            Back to Login
          </Link>
        </form>
      )}
    </AuthCard>
  );
}
