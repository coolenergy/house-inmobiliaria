// From prisma schema:
// enum Washing {
//   UNIT
//   BUILDING
//   AVAILABLE
//   NONE
// }

// enum Parking {
//   COVERED
//   PUBLIC
//   PRIVATE
//   AVAILABLE
//   NONE
// }

// enum Heating {
//   CENTRAL
//   ELECTRIC
//   GAS
//   RADIATORS
//   AVAILABLE
//   NONE
// }

export const translations = {
  HOUSE: "Casa",
  APARTMENT: "Departamento",
  LAND: "Terreno",
  SALE: "Venta",
  RENT: "Renta",
  TRANSFER: "Traspaso",
  UNIT: "En unidad",
  BUILDING: "En edificio",
  AVAILABLE: "Disponible",
  NONE: "No disponible",
  COVERED: "Cubierto",
  PUBLIC: "En vía pública",
  PRIVATE: "Privado",
  CENTRAL: "Central",
  ELECTRIC: "Eléctrico",
  GAS: "Gas",
  RADIATORS: "Radiadores",
} as const;
