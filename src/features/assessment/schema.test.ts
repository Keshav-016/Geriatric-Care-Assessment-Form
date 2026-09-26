import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './schema';

const baseAssessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1966-08-07',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};

describe('assessmentSchema', () => {
  it('accepts exactly 60 and rejects one day short', () => {
    const exactly60 = assessmentSchema.safeParse(baseAssessment);
    const oneDayShort = assessmentSchema.safeParse({
      ...baseAssessment,
      dateOfBirth: '1966-08-08',
    });

    expect(exactly60.success).toBe(true);
    expect(oneDayShort).toMatchObject({
      success: false,
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ['dateOfBirth'],
            message: 'This pathway is for patients aged 60 and over',
          }),
        ]),
      },
    });
  });
});
