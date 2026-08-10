import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '../features/auth/authApi.js';
import { setCredentials } from '../features/auth/authSlice.js';
import { FormField } from '../components/ui/FormField.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const result = await adminLogin({ email, password }).unwrap();
      dispatch(setCredentials(result.data));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.data?.message || 'Unable to sign in. Please try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-2xl text-white">
            🚚
          </span>
          <h1 className="text-lg font-extrabold tracking-tight text-gray-900">CLASSYSHOP</h1>
          <p className="text-xs font-medium tracking-wide text-gray-400">ADMIN PANEL</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@classyshop.com"
          />
          <FormField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isLoading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
