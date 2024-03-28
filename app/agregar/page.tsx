import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import PropertyForm from "@/components/property-form";
import { redirect } from "next/navigation";

export default async function AddPage() {
  const { sessionClaims } = auth();
  const isAdmin = !!sessionClaims?.isAdmin;
  if (!isAdmin) redirect("/");

  return (
    <main className="container flex flex-col items-center gap-2 p-2">
      <PropertyForm
        revalidate={async (path) => {
          "use server";
          revalidatePath(path);
        }}
      />
    </main>
  );
}
