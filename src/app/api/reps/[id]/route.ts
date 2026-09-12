import { NextResponse } from "next/server";
import { getRepDashboard } from "@/lib/diagnosis";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const dashboard = getRepDashboard(id);
  if (!dashboard) {
    return NextResponse.json({ error: "Rep not found" }, { status: 404 });
  }
  return NextResponse.json(dashboard);
}
