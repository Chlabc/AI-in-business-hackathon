import { promises as fs } from "fs";
import path from "path";
import { DEMO_REP_ID } from "@/data/seed";

export type ShareSettings = {
  repId: string;
  shareProgressWithManager: boolean;
  updatedAt: string;
};

const STORE = path.join(process.cwd(), "data", "share-settings.json");

async function readAll(): Promise<Record<string, ShareSettings>> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, ShareSettings>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeAll(map: Record<string, ShareSettings>): Promise<void> {
  await fs.mkdir(path.dirname(STORE), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(map, null, 2), "utf8");
}

export async function getShareSettings(
  repId: string = DEMO_REP_ID,
): Promise<ShareSettings> {
  const all = await readAll();
  return (
    all[repId] ?? {
      repId,
      shareProgressWithManager: false,
      updatedAt: new Date(0).toISOString(),
    }
  );
}

export async function setShareSettings(
  repId: string,
  shareProgressWithManager: boolean,
): Promise<ShareSettings> {
  const all = await readAll();
  const row: ShareSettings = {
    repId,
    shareProgressWithManager,
    updatedAt: new Date().toISOString(),
  };
  all[repId] = row;
  await writeAll(all);
  return row;
}
