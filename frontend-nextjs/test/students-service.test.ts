import { describe, it, expect, vi } from 'vitest';
import { studentsService } from '../app/students/actions';

describe('studentsService', () => {
  it('returns students and stats', async () => {
    const payload = { students: [{ id: 1, username: 'test', email: 't@t', course: 'C1', total_evaluations: 0, average_grade: 0, last_evaluation: null }], stats: { total_students: 1, total_courses: 1, global_average: 0 } };
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(payload)) }));

    const res = await studentsService.getStudents();
    expect(res).toEqual(payload);
  });
});
