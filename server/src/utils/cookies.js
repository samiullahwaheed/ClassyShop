import { env } from '../config/env.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: THIRTY_DAYS_MS,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
}
