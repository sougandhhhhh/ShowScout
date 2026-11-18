import { describe, expect, it } from 'vitest';
import app from './index';

describe('public API', () => {
  it('serves health and compare data', async () => {
    const health = await app.request('http://localhost/api/v1/health');
    const compare = await app.request('http://localhost/api/v1/compare?movie=rekhachithram');
    expect(health.status).toBe(200);
    expect((await compare.json()).data.theatres.length).toBeGreaterThan(0);
  });
  it('requires operator authentication before validating feeds', async () => {
    const response = await app.request('http://localhost/api/v1/feeds/thr-1/shows', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shows: [] }) });
    expect(response.status).toBe(401);
  });
  it('uses a pending claim and rejects unverified imports', async () => {
    const signup = await app.request('http://localhost/api/v1/operator/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'owner@example.com', password: 'strong-pass-123', theatreId: 'thr-1' }) });
    const login = await app.request('http://localhost/api/v1/operator/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'owner@example.com', password: 'strong-pass-123' }) });
    const token = (await login.json() as { data: { token: string } }).data.token;
    const csv = await app.request('http://localhost/api/v1/portal/import', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ csv: 'movie_id,starts_at,format,language,price_paise\nmov-1,2026-11-18T18:30:00Z,2D,Malayalam,18000' }) });
    expect(signup.status).toBe(201);
    expect(login.status).toBe(200);
    expect(csv.status).toBe(403);
  });
  it('returns validation and not-found errors', async () => {
    const invalid = await app.request('http://localhost/api/v1/compare?sort=invalid');
    const missing = await app.request('http://localhost/api/v1/compare?movie=missing-movie');
    expect(invalid.status).toBe(400);
    expect((await invalid.json() as { error: { code: string } }).error.code).toBe('VALIDATION_ERROR');
    expect(missing.status).toBe(404);
  });
});
