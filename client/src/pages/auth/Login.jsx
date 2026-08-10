import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useLoginMutation } from '../../features/auth/authApi.js';
import { setCredentials } from '../../features/auth/authSlice.js';
import AuthCard from '../../components/auth/AuthCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result.data));
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err?.data?.message || 'Unable to sign in. Please try again.');
    }
  }

  return (
    <AuthCard title="Login to your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        </div>

        <Link to="/forgot-password" className="text-sm font-medium text-gray-700 hover:text-brand-500">
          Forgot Password?
        </Link>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {isLoading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
          LOGIN
        </button>

        <p className="text-center text-sm text-gray-600">
          Not Registered?{' '}
          <Link to="/register" className="font-medium text-brand-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
