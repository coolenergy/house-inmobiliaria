"use client";
import { Property, Subtype, Operation } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef, Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { translations } from "@/lib/constants";
import TableDropDownMenu from "./table-dd-menu";

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortButton column={column}>Id</SortButton>,
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "subtype",
    header: ({ column }) => <SortButton column={column}>Subtipo</SortButton>,
    cell: ({ row }) => {
      const subtype: Subtype = row.getValue("subtype");
      return <div>{translations[subtype]}</div>;
    },
  },
  {
    accessorKey: "operation",
    header: ({ column }) => <SortButton column={column}>Operación</SortButton>,
    cell: ({ row }) => {
      const operation: Operation = row.getValue("operation");
      return <div>{translations[operation]}</div>;
    },
  },
  {
    accessorKey: "images",
    header: () => <p className="min-w-[10rem]">Preview</p>,
    cell: ({ row }) => {
      const images: string[] = row.getValue("images");
      return (
        <picture>
          <img
            className="mx-auto h-40 w-40 rounded object-cover"
            src={images[0]}
            alt="Preview de la propiedad"
          />
        </picture>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <SortButton column={column}>Precio (MXN)</SortButton>
    ),
    cell: ({ row }) => {
      const price = parseInt(row.getValue("price"));
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
      return <TableDropDownMenu property={property} />;
    },
  },
];

export const adminColumns = columns.toSpliced(2, 0, {
  accessorKey: "commission",
  header: ({ column }) => <SortButton column={column}>Comisión</SortButton>,
  cell: ({ row }) => <div>{row.getValue("commission")}%</div>,
});

function SortButton({
  column,
  children,
}: {
  column: Column<Property>;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="mx-auto flex gap-2 whitespace-nowrap text-base"
    >
      {children}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
}
