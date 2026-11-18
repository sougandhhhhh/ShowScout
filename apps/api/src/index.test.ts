import { describe, expect, it } from 'vitest';
import app from './index';

describe('public API', () => {
  it('serves health and compare data', async () => {
    const health = await app.request('http://localhost/api/v1/health');
    const compare = await app.request('http://localhost/api/v1/compare?movie=rekhachithram');
    expect(health.status).toBe(200);
    expect((await compare.json()).data.theatres.length).toBeGreaterThan(0);
  });
  it('validates operator feeds', async () => {
    const response = await app.request('http://localhost/api/v1/feeds/thr-1/shows', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shows: [] }) });
    expect(response.status).toBe(400);
  });
  it('supports operator signup and CSV validation', async () => {
    const signup = await app.request('http://localhost/api/v1/operator/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'owner@example.com', password: 'strong-pass-123', theatreId: 'thr-1' }) });
    const csv = await app.request('http://localhost/api/v1/portal/import', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ csv: 'movie_id,starts_at,format,language,price_paise\nmov-1,2026-11-18T18:30:00Z,2D,Malayalam,18000' }) });
    expect(signup.status).toBe(201);
    expect(csv.status).toBe(202);
  });
});
