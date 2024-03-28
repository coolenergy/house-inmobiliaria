import { useState, useCallback } from "react";
import { UploadIcon, XIcon } from "lucide-react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { FileWithPath } from "@uploadthing/react";

import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

type Props = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};
export default function MultiUploader({ setFiles }: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setUrls((prevData) => [
      ...prevData,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setFiles((prevData) => [...prevData, ...acceptedFiles]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permittedFileInfo } = useUploadThing("imageUploader");

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      className="flex cursor-default flex-col items-center gap-2 rounded-md border-2 border-dashed p-4"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <UploadIcon />
      <p className="text-center font-bold">Agregar fotos</p>
      <p className="hidden sm:block">o arrastralas y sueltalas</p>
      <div className="flex flex-wrap justify-center gap-2">
        {urls.map((url, i) => (
          <picture className="group relative" key={i}>
            <img className="h-40 w-40 rounded object-cover" src={url} alt="" />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setFiles((files) => files.filter((_, j) => i !== j));
                setUrls((urls) => urls.filter((_, j) => i !== j));
              }}
              className="absolute right-1 top-1 h-8 rounded-full px-2 py-1 sm:hidden sm:group-hover:block"
              variant="secondary"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </picture>
        ))}
      </div>
    </div>
  );
}
