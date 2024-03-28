/* eslint-disable jsx-a11y/alt-text */
// ^Added this because react-pdf Image component doesn't support alt prop
import { type Property } from "@prisma/client";
import {
  Document,
  StyleSheet,
  Page,
  View,
  Text,
  Image,
  Svg,
  Circle,
} from "@react-pdf/renderer";

import { translations } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 10,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
});

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Datasheet({ property }: { property: Property }) {
  const price = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(property.price);

  let coordinates;
  if (
    typeof property.coordinates === "object" &&
    property.coordinates != null &&
    "lat" in property.coordinates &&
    "lng" in property.coordinates
  ) {
    coordinates = `${property.coordinates.lat},${property.coordinates.lng}`;
  }

  return (
    <Document title={`Propiedad ${property.id}`}>
      <Page style={styles.page}>
        <Text style={{ textAlign: "right", fontSize: 10 }}>
          ID: {property.id}
        </Text>
        <View
          style={{
            backgroundColor: "#e6e7e8",
          }}
        >
          <Image
            style={{ width: "40%", margin: "0 auto" }}
            src={property.images[0]}
          />
        </View>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            color: "hsl(142.1, 76.2%, 36.3%)",
            fontSize: 14,
          }}
        >
          {translations[property.subtype]} en {translations[property.operation]}
        </Text>
        <Text>{property.address}</Text>
        <Separator />
        <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold" }}>
          {translations[property.operation]}: {price} MXN
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ width: "50%" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              Tipo de propiedad:
            </Text>{" "}
            {translations[property.subtype]}
          </Text>
          <Text style={{ width: "50%" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              Tipo de operación:
            </Text>{" "}
            {translations[property.operation]}
          </Text>
        </View>
        <Separator />
        <List>
          <Item decorated>
            <Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Recámaras:</Text>{" "}
              {property.bedrooms}
            </Text>
          </Item>
          <Item decorated>
            <Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Baños:</Text>{" "}
              {property.bathrooms}
            </Text>
          </Item>
          {property.area != null && (
            <Item decorated>
              <Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Área:</Text>{" "}
                {property.area} m²
              </Text>
            </Item>
          )}
          {property.parking != null && (
            <Item decorated>
              <Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  Estacionamiento:
                </Text>{" "}
                {translations[property.parking]}
              </Text>
            </Item>
          )}
          {property.washing != null && (
            <Item decorated>
              <Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Lavadora:</Text>{" "}
                {translations[property.washing]}
              </Text>
            </Item>
          )}
          {property.heating != null && (
            <Item decorated>
              <Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  Calefacción:
                </Text>{" "}
                {translations[property.heating]}
              </Text>
            </Item>
          )}
        </List>
        <Separator />
        <Text style={{ fontFamily: "Helvetica-Bold" }}>Descripción:</Text>
        <Text>{property.description}</Text>
        {property.coordinates != null && (
          <>
            <Separator />
            <View break>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Referencias:</Text>
              <Image
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${coordinates}&zoom=15&size=600x300&markers=color:red%7C${coordinates}&key=${API_KEY}`}
                style={{ width: "80%", margin: "0 auto" }}
              />
            </View>
          </>
        )}
      </Page>
      <Page style={styles.page}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>Catálogo de fotos:</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {property.images.map((image, index) => (
            <Image
              style={{ width: "49%", objectFit: "contain" }}
              src={image}
              key={index}
            />
          ))}
        </View>
        <View>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
            Propiedad sujeta a disponibilidad.
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
            Precio sujeto a cambios sin previo aviso.
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
            El envío de esta ficha no compromete a las partes a la suscripción
            de ningún documento legal.
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
            La información y medidas son aproximadas y deberán ratificarse con
            la documentación pertinente.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        lineHeight: 1.5,
      }}
    >
      {children}
    </View>
  );
}

function Item({
  children,
  decorated,
}: {
  children: React.ReactNode;
  decorated?: boolean;
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        width: "50%",
      }}
    >
      {decorated && (
        <Svg width={2} height={2}>
          <Circle cx="1" cy="1" r="2" fill="#000" />
        </Svg>
      )}
      {children}
    </View>
  );
}

function Separator() {
  return (
    <View
      style={{
        width: "100%",
        height: 2,
        backgroundColor: "#e6e7e8",
      }}
    />
  );
}
