"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleDashed } from "lucide-react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useMutation } from "@tanstack/react-query";
import { type Property } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { formSchema } from "@/lib/validations";
import MultiUploader from "@/components/multi-uploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createProperty, editProperty } from "@/app/actions";

type Props = {
  revalidate?: (path: string) => void;
  isEdit?: boolean;
  property?: Property;
  closeSheet?: () => void;
};

export default function PropertyForm({
  revalidate,
  isEdit,
  property,
  closeSheet,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: mutateAsyncEdit } = useMutation({
    mutationFn: editProperty,
    onSuccess: router.refresh,
  });
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [coordinates, setCoordinates] = useState(
    (property?.coordinates as { lat: number; lng: number }) ?? {
      lat: 0,
      lng: 0,
    },
  );
  let initialValues = {};
  if (property) initialValues = { ...property };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptsCredit: false,
      ...initialValues,
    },
  });
  const { startUpload } = useUploadThing("imageUploader");
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    // isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    debounce: 500,
    options: {
      componentRestrictions: {
        country: "mx",
      },
      fields: ["geometry.location"],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    if (isEdit && property) {
      try {
        await mutateAsyncEdit({ id: property.id, ...values, coordinates });
        if (closeSheet) closeSheet();
        toast({
          title: "Éxito",
          description: "La propiedad se editó correctamente.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description:
            "Ocurrió un error al editar la propiedad, intente de nuevo.",
          variant: "destructive",
        });
      }
    } else {
      if (!files.length) {
        toast({
          title: "Error",
          description: "Debe agregar al menos una imagen.",
          variant: "destructive",
        });
        return;
      }
      try {
        const utResponse = await startUpload(files);
        const urls: string[] = [];
        const keys: string[] = [];
        for (const img of utResponse!) {
          urls.push(img.url);
          keys.push(img.key);
        }
        await createProperty({
          ...values,
          images: urls,
          imageKeys: keys,
          coordinates,
        });
        if (revalidate) revalidate("/");
        router.push("/");
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description:
            "Ocurrió un error al agregar la propiedad, intente de nuevo.",
          variant: "destructive",
        });
      }
    }
    setSubmitting(false);
  }
  useEffect(() => {
    if (placePredictions.length) {
      placesService?.getDetails(
        {
          placeId: placePredictions[0].place_id,
        },
        (place: any) => {
          setCoordinates({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placePredictions]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-4"
        >
          {/* Images */}
          {!isEdit && <MultiUploader setFiles={setFiles} />}
          {/* Operation */}
          <FormField
            control={form.control}
            name="operation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        className="text-muted-foreground"
                        placeholder="Venta, renta o traspaso"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">Venta</SelectItem>
                      <SelectItem value="RENT">Renta</SelectItem>
                      <SelectItem value="TRANSFER">Traspaso</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Subtype */}
          <FormField
            control={form.control}
            name="subtype"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOUSE">Casa</SelectItem>
                      <SelectItem value="APARTMENT">Departamento</SelectItem>
                      <SelectItem value="LAND">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bedrooms */}
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Número de habitaciones"
                    type="number"
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bathrooms */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Número de baños"
                    type="number"
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Precio (MXN)"
                    type="number"
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Input
                      {...field}
                      placeholder="Dirección"
                      type="text"
                      id={field.name}
                      list="addressList"
                      onChange={(e) => {
                        field.onChange(e);
                        getPlacePredictions({ input: e.target.value });
                      }}
                      autoComplete="off"
                      disabled={submitting}
                    />
                    <datalist className="w-full" id="addressList">
                      {placePredictions?.map((place) => (
                        <option key={place.place_id} value={place.description}>
                          {place.description}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descripción"
                    id={field.name}
                  />
                </FormControl>
                <FormDescription>
                  Incluye detalles, como los servicios incluidos, las
                  instalaciones, los depósitos necesarios y la disponibilidad.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Commission */}
          <FormField
            control={form.control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Comisión (%)"
                    type="number"
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Accepts credit */}
          <FormField
            control={form.control}
            name="acceptsCredit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor={field.name}>Acepta crédito</Label>
                  </div>
                </FormControl>
                <FormDescription>
                  Crédito Infonavit, Fovissste, bancario, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-semibold">Opciones adicionales</span>
            <span className="text-sm text-muted-foreground">Opcional</span>
          </div>
          {/* Area */}
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Metros cuadrados"
                    type="number"
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Washing */}
          <FormField
            control={form.control}
            name="washing"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de lavadero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNIT">
                        Lavadero en la unidad
                      </SelectItem>
                      <SelectItem value="BUILDING">
                        Lavadero en el edificio
                      </SelectItem>
                      <SelectItem value="AVAILABLE">
                        Lavadero disponible
                      </SelectItem>
                      <SelectItem value="NONE">Ninguno</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Parking */}
          <FormField
            control={form.control}
            name="parking"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de estacionamiento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COVERED">
                        Estacionamiento cubierto
                      </SelectItem>
                      <SelectItem value="PUBLIC">
                        Estacionamiento en la vía pública
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        Estacionamiento privado
                      </SelectItem>
                      <SelectItem value="AVAILABLE">
                        Estacionamiento disponible
                      </SelectItem>
                      <SelectItem value="NONE">Ninguno</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Heating */}
          <FormField
            control={form.control}
            name="heating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de calefacción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CENTRAL">
                        Calefacción central
                      </SelectItem>
                      <SelectItem value="ELECTRIC">
                        Calefacción eléctrica
                      </SelectItem>
                      <SelectItem value="GAS">Calefacción de gas</SelectItem>
                      <SelectItem value="RADIATORS">
                        Calefacción por radiadores
                      </SelectItem>
                      <SelectItem value="AVAILABLE">
                        Calefacción disponible
                      </SelectItem>
                      <SelectItem value="NONE">Ninguno</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <Button
            className={cn("gap-1 font-bold", {
              "cursor-wait": submitting,
            })}
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <>
                {isEdit ? "Guardando" : "Agregando"}{" "}
                <CircleDashed className="animate-spin" />
              </>
            ) : isEdit ? (
              "Guardar"
            ) : (
              "Agregar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
