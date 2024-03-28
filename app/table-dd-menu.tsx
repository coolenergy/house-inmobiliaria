"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Property } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  MoreVertical,
  FileText,
  Clipboard,
  CopyCheck,
  Trash,
  Download,
  Pencil,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { deleteProperty } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import PropertyForm from "@/components/property-form";
import Datasheet from "@/components/datasheet";

export default function TableDropDownMenu({
  property,
}: {
  property: Property;
}) {
  const { user } = useUser();
  const isAdmin = !!user?.publicMetadata?.isAdmin;
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: mutateAsyncDelete } = useMutation({
    mutationFn: deleteProperty,
    onSuccess: router.refresh,
  });
  const [width, setWidth] = useState(770);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Menú</DropdownMenuLabel>
            {isMobile ? (
              <DropdownMenuItem className="gap-1 p-0">
                <PDFDownloadLink
                  document={<Datasheet property={property} />}
                  fileName={`propiedad-${property.id}`}
                  className="flex cursor-default items-center gap-1 p-2"
                >
                  {({ loading }) => (
                    <>
                      <Download />
                      <span
                        className={cn("transition-opacity", {
                          "opacity-70": loading,
                        })}
                      >
                        {loading
                          ? "Generando ficha técnica"
                          : "Descargar ficha técnica"}{" "}
                      </span>
                    </>
                  )}
                </PDFDownloadLink>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="gap-1" asChild>
                <Link href={`/ficha/${property.id}`}>
                  <FileText />
                  Ver ficha técnica
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(property.id.toString());
                toast({
                  description: (
                    <div className="flex items-center gap-2">
                      <CopyCheck />
                      Id {property.id} copiada
                    </div>
                  ),
                });
              }}
              className="gap-1"
            >
              <Clipboard />
              Copiar ID
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => setIsEditSheetOpen(true)}
                  className="gap-1"
                >
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="gap-1"
                >
                  <Trash />
                  Eliminar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ¿Seguro que quieres eliminar esta propiedad?
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={async () => {
                  await mutateAsyncDelete(property.id);
                  toast({
                    description: (
                      <div className="flex items-center gap-2">
                        <Trash />
                        Propiedad con id {property.id} eliminada.
                      </div>
                    ),
                  });
                }}
                variant="destructive"
              >
                Eliminar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar propiedad</SheetTitle>
          <SheetDescription>
            Modificar la información de la propiedad.
          </SheetDescription>
        </SheetHeader>
        <PropertyForm
          property={property}
          closeSheet={() => setIsEditSheetOpen(false)}
          isEdit
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button className="mt-2 w-full" variant="outline">
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
