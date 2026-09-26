# Geriatric Care Assessment Form

A one-page Geriatric Care Assessment form built for the supplied frontend take-home assignment.

Deployed Url : https://geriatric-care-assessment-form.netlify.app/

## Stack

- React 19
- TypeScript
- Vite
- Mantine Core
- Mantine Dates
- `@mantine/form`
- Zod 4
- Vitest + React Testing Library

React Hook Form is intentionally not used. The assignment explicitly asks for `@mantine/form` and `schemaResolver`, so the implementation follows that requirement.

## How it works

1. `src/features/assessment/schema.ts` contains the supplied Zod schema and its three cross-field rules. The `Assessment` type is inferred directly from the schema with `z.infer`.
2. `AssessmentPage.tsx` uses Mantine `useForm` with `schemaResolver(assessmentSchema, { sync: true })`. Validation therefore remains in the schema rather than being duplicated in JSX.
3. Validation runs on blur and submit. Errors are rendered by Mantine on the individual fields; there is no top-level error summary.
4. The assessment date uses `maxDate={new Date()}` as required. The mobility dropdown is generated from `MOBILITY`, so adding a value to that array automatically adds an option.
5. `Load sample patient` fills the form with the supplied invented valid fixture.
6. On a valid submit, the same Zod schema parses the values, the handler waits about 800ms to simulate saving, and the parsed result is displayed in a Mantine `Code` block inside a success `Alert`. An optional `onSave` callback receives the parsed values and is exercised by the rendered-form test.
7. The save is simulated and held only in page state. There is no backend or database, so submitted assessments are not persisted across reloads. There is also no authentication, routing, state library, toast system, or Storybook. Styling is limited to Mantine plus a small assessment stylesheet.


## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Tests and checks

Run the complete check with:

```bash
npm test
```

The script runs TypeScript checking, formatting checks, linting, Vitest, and the production build.

The two assignment tests are:

- Schema boundary: exactly 60 versus one day short.
- Rendered form: load the sample fixture, submit it, and assert the save callback receives the schema-parsed values.

## Validation behavior

The supplied schema is used as the source of truth:

- MRN must match `MRN-` followed by six digits.
- Patient name is 2–60 characters after trimming.
- Patient must be at least 60 on the assessment date.
- Barthel Index is an integer from 0–100 in steps of 5.
- Medication count is an integer from 0–30.
- Five or more medications requires pharmacist review.
- Next review date must be after assessment date.
- Consent must be true.

No validation rule is reimplemented in the component.

Estimated implementation time: approximately 1.5 hours.
