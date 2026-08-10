import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../features/auth/authApi.js';
import { setCredentials } from '../../features/auth/authSlice.js';
import AuthCard from '../../components/auth/AuthCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      const result = await register({ name: form.name, email: form.email, password: form.password }).unwrap();
      dispatch(setCredentials(result.data));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.data?.message || 'Unable to create your account.');
    }
  }

  return (
    <AuthCard title="Create your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="email"
          required
          placeholder="Email Id"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {isLoading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
          SIGN UP
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
