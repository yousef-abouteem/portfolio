import { requireAdmin } from "@/lib/require-admin";
import { emptyProject } from "@/lib/validations/project";
import ProjectForm from "../ProjectForm";
import { createProject } from "../actions";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">New project</h1>
      <ProjectForm
        initialValues={emptyProject}
        onSubmit={createProject}
        submitLabel="Create project"
      />
    </main>
  );
}