import { describe, it, expect, vi } from 'vitest';
import { evaluationService } from '../lib/api/teacher/evaluations';

describe('evaluationService', () => {
  it('getEvaluations returns list', async () => {
    const payload = [{ id: 1, title: 'Test', category: 'math', duration_minutes: 60, status: 'draft', created_at: '2024-01-01' }];
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(payload)) }));

    const res = await evaluationService.getEvaluations();
    expect(res).toEqual(payload);
  });
});
