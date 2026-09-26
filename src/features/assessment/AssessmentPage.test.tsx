import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AssessmentPage } from './AssessmentPage';
import { samplePatient } from './fixtures';
import { assessmentSchema } from './schema';

test('loads the sample patient and submits the parsed values', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  render(
    <MantineProvider>
      <Notifications />
      <AssessmentPage onSave={onSave} />
    </MantineProvider>
  );

  await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
  await user.click(screen.getByRole('button', { name: 'Save assessment' }));

  expect(await screen.findByRole('dialog')).toHaveTextContent('Confirm assessment');
  expect(onSave).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Confirm and save' }));

  expect(
    await screen.findByText('The patient assessment was saved successfully.')
  ).toBeInTheDocument();
  expect(onSave).toHaveBeenCalledWith(assessmentSchema.parse(samplePatient));
});
