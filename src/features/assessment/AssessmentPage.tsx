import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { samplePatient } from './fixtures';
import { assessmentSchema, MOBILITY, type Assessment } from './schema';
import './assessment.css';

type AssessmentFormValues = {
  mrn: string;
  patientName: string;
  dateOfBirth: string;
  assessmentDate: string;
  mobility: Assessment['mobility'] | '';
  barthelIndex: number | '';
  medicationCount: number | '';
  pharmacistReviewRequested: boolean;
  followUpDate: string;
  consentObtained: boolean;
};

const emptyValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: value.replace(/_/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase()),
}));

export function AssessmentPage({
  onSave,
}: { onSave?: (values: Assessment) => void | Promise<void> } = {}) {
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);
  const [pendingAssessment, setPendingAssessment] = useState<Assessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AssessmentFormValues, Assessment>({
    mode: 'controlled',
    initialValues: emptyValues,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
    validateInputOnChange: false,
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const loadSamplePatient = () => {
    setSavedAssessment(null);
    form.setValues(samplePatient);
    form.clearErrors();
  };

  const submit = async (values: Assessment) => {
    setPendingAssessment(values);
  };

  const confirmSave = async () => {
    if (!pendingAssessment) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(pendingAssessment);
      setSavedAssessment(pendingAssessment);
      setPendingAssessment(null);
      notifications.show({
        title: 'Assessment saved',
        message: 'The patient assessment was saved successfully.',
        color: 'teal',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Container size="sm" py="xl" className="assessment-page">
        <Paper withBorder p="xl" radius="md" className="assessment-card">
          <Stack gap="lg">
            <Stack gap={4}>
              <Text className="assessment-kicker">Patient services</Text>
              <Title order={1} className="assessment-title">
                Geriatric Care Assessment
              </Title>
              <Text size="sm" c="dimmed">
                Patient details and follow-up
              </Text>
            </Stack>

            <form onSubmit={form.onSubmit(submit)}>
              <Stack gap="md">
                <TextInput
                  label="Medical record number"
                  placeholder="MRN-004821"
                  {...form.getInputProps('mrn')}
                />

                <TextInput label="Patient name" {...form.getInputProps('patientName')} />

                <DateInput
                  label="Date of birth"
                  valueFormat="YYYY-MM-DD"
                  value={form.values.dateOfBirth || null}
                  onChange={(value) => form.setFieldValue('dateOfBirth', value ?? '')}
                  onBlur={() => form.validateField('dateOfBirth')}
                  error={form.errors.dateOfBirth}
                />

                <DateInput
                  label="Assessment date"
                  valueFormat="YYYY-MM-DD"
                  maxDate={new Date()}
                  value={form.values.assessmentDate || null}
                  onChange={(value) => form.setFieldValue('assessmentDate', value ?? '')}
                  onBlur={() => form.validateField('assessmentDate')}
                  error={form.errors.assessmentDate}
                />

                <Select
                  label="Mobility"
                  data={mobilityOptions}
                  {...form.getInputProps('mobility')}
                />

                <NumberInput
                  label="Barthel Index"
                  step={5}
                  min={0}
                  max={100}
                  {...form.getInputProps('barthelIndex')}
                />

                <NumberInput
                  label="Regular medications"
                  min={0}
                  max={30}
                  {...form.getInputProps('medicationCount')}
                />

                <Checkbox
                  label="Pharmacist review requested"
                  {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
                />

                <DateInput
                  label="Next review date"
                  valueFormat="YYYY-MM-DD"
                  value={form.values.followUpDate || null}
                  onChange={(value) => form.setFieldValue('followUpDate', value ?? '')}
                  onBlur={() => form.validateField('followUpDate')}
                  error={form.errors.followUpDate}
                />

                <Checkbox
                  label="Patient or representative has given consent"
                  {...form.getInputProps('consentObtained', { type: 'checkbox' })}
                />

                <Group justify="space-between" mt="sm">
                  <Button type="button" variant="default" onClick={loadSamplePatient}>
                    Load sample patient
                  </Button>
                  <Button type="submit" loading={form.submitting}>
                    Save assessment
                  </Button>
                </Group>
              </Stack>
            </form>

            {savedAssessment ? (
              <Alert title="Assessment saved" color="green">
                <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
              </Alert>
            ) : null}
          </Stack>
        </Paper>
      </Container>

      <Modal
        opened={pendingAssessment !== null}
        onClose={() => setPendingAssessment(null)}
        title="Confirm assessment"
        centered
      >
        <Stack gap="md">
          <Text>
            Save the assessment for {pendingAssessment?.patientName ?? ''}? Please confirm the
            patient details are ready to be saved.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setPendingAssessment(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={confirmSave} loading={isSaving}>
              Confirm and save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
