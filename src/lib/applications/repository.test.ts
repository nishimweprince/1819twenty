import { beforeEach, describe, expect, it, vi } from "vitest";

const { listMock } = vi.hoisted(() => ({ listMock: vi.fn() }));
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({ storage: { from: () => ({ list: listMock }) } }),
}));
import { verifyUploads } from "./repository";

const id = "550e8400-e29b-41d4-a716-446655440000";
const paths = [1, 2, 3].map((n) => `${id}/work-${n}.jpg`);

beforeEach(() => {
  listMock.mockReset();
  listMock.mockResolvedValue({ data: paths.map((path) => ({ name: path.split("/")[1] })), error: null });
});

describe("verifyUploads", () => {
  it("checks all three distinct photos with one folder listing", async () => {
    expect(await verifyUploads(id, paths)).toBe(true);
    expect(listMock).toHaveBeenCalledTimes(1);
    expect(listMock).toHaveBeenCalledWith(id, { limit: 100 });
  });
  it("rejects missing, duplicate, foreign, or nested paths", async () => {
    expect(await verifyUploads(id, [...paths.slice(0, 2), `${id}/missing.jpg`])).toBe(false);
    expect(await verifyUploads(id, [paths[0], paths[0], paths[1]])).toBe(false);
    expect(await verifyUploads(id, [paths[0], paths[1], `another-id/work-3.jpg`])).toBe(false);
    expect(await verifyUploads(id, [paths[0], paths[1], `${id}/nested/work-3.jpg`])).toBe(false);
  });
});
