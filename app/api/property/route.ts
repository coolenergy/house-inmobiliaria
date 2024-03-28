import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { utapi } from "@/lib/uploadthing-server";
import { db } from "@/lib/prisma";
import { propertySchema, editPropertySchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  if (!isAdmin())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const data = propertySchema.parse(body);
    await db.property.create({ data });
    return NextResponse.json({ message: "Property created" });
  } catch (error) {
    console.error(error);
    if (body?.imageKeys?.length) {
      await utapi.deleteFiles(body.imageKeys);
    }
    return NextResponse.json(
      { message: "An error occured creating the property" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const data = editPropertySchema.parse(body);
    await db.property.update({ where: { id: data.id }, data });
    return NextResponse.json({ message: "Property updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occured updating the property" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const property = await db.property.findUnique({
    select: { imageKeys: true },
    where: { id },
  });
  if (property && property.imageKeys.length) {
    await utapi.deleteFiles(property.imageKeys);
  }
  await db.property.delete({ where: { id } });
  return NextResponse.json({ message: "Property deleted" });
}

function isAdmin() {
  const { sessionClaims } = auth();
  return !!sessionClaims?.isAdmin;
}
