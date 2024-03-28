import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
  })
    .middleware(async () => {
      const { sessionClaims } = auth();
      const isAdmin = !!sessionClaims?.isAdmin;
      if (!isAdmin) {
        throw new Error("Client is not authorized to upload files");
      }
      return {};
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
