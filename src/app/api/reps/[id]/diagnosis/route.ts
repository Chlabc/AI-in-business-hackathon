import { NextResponse } from "next/server";
import { diagnoseRep } from "@/lib/diagnosis";
import { getRep } from "@/data/seed";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  if (!getRep(id)) {
    return NextResponse.json({ error: "Rep not found" }, { status: 404 });
  }
  const diagnosis = diagnoseRep(id);
  if (!diagnosis) {
    return NextResponse.json({ error: "No call data" }, { status: 404 });
  }
  return NextResponse.json(diagnosis);
}
