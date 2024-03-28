import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import i18next from "i18next";
import translation from "zod-i18n-map/locales/es/zod.json";

i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

export const formSchema = z.object({
  operation: z.enum(["SALE", "RENT", "TRANSFER"]),
  subtype: z.enum(["HOUSE", "APARTMENT", "LAND"]),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  price: z.number().int().positive(),
  address: z.string().min(1),
  description: z.string().min(1),
  commission: z.number().multipleOf(0.01).nonnegative(),
  acceptsCredit: z.boolean(),
  area: z.number().int().positive().optional(),
  washing: z.enum(["UNIT", "BUILDING", "AVAILABLE", "NONE"]).optional(),
  parking: z
    .enum(["COVERED", "PUBLIC", "PRIVATE", "AVAILABLE", "NONE"])
    .optional(),
  heating: z
    .enum(["CENTRAL", "ELECTRIC", "GAS", "RADIATORS", "AVAILABLE", "NONE"])
    .optional(),
});

export const propertySchema = formSchema.extend({
  images: z.array(z.string().url()),
  imageKeys: z.array(z.string()),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

export const editPropertySchema = formSchema.extend({
  id: z.number(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});
