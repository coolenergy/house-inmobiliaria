import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@clerk/nextjs";

import getQueryClient from "@/lib/query";
import { getProperties } from "@/app/actions";
import { columns, adminColumns } from "@/app/columns";
import DataTable from "@/app/data-table";

export default async function Home() {
  const { sessionClaims } = auth();
  const isAdmin = !!sessionClaims?.isAdmin;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="container p-2">
      <HydrationBoundary state={dehydratedState}>
        <DataTable
          columns={isAdmin ? adminColumns : columns}
          isAdmin={isAdmin}
        />
      </HydrationBoundary>
    </main>
  );
}
