// apps/admin/src/app/api/artworks/route.ts
import { NextResponse } from "next/server";

// Placeholder for actual DB or Supabase call
const mockArtworks = [
  { id: "1", title: "Sunflowers", artist: "Van Gogh" },
  { id: "2", title: "Starry Night", artist: "Van Gogh" },
];

export const GET = async () => {
  return NextResponse.json({ artworks: mockArtworks });
};
