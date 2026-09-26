import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { AssessmentPage } from './AssessmentPage';
import { samplePatient } from './fixtures';
import { assessmentSchema } from './schema';

test('loads the sample patient and submits the parsed values', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  render(
    <MantineProvider>
      <AssessmentPage onSave={onSave} />
    </MantineProvider>
  );

  await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
  await user.click(screen.getByRole('button', { name: 'Save assessment' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Assessment saved');
  expect(onSave).toHaveBeenCalledWith(assessmentSchema.parse(samplePatient));
});
