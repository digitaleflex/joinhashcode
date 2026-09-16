import { checkAdmin } from "@/lib/admin-auth";
import { getSnapshots, createSnapshot } from "@/lib/mission-versioning";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  label: z.string().optional().nullable(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const snapshots = await getSnapshots(id);
    return NextResponse.json({ snapshots });
  } catch (error) {
    console.error("[ADMIN_SNAPSHOTS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { label } = createSchema.parse(body);

    const snapshot = await createSnapshot(id, label);
    return NextResponse.json(snapshot, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_SNAPSHOTS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
