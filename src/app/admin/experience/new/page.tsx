import { requireAdmin } from "@/lib/require-admin";
import { emptyExperience } from "@/lib/validations/experience";
import ExperienceForm from "../ExperienceForm";
import { createExperience } from "../actions";

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">New entry</h1>
      <ExperienceForm
        initialValues={emptyExperience}
        onSubmit={createExperience}
        submitLabel="Create"
      />
    </main>
  );
}
