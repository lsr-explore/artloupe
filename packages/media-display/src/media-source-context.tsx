"use client";

import type { ImageType } from "@artloupe/shared-types";
import { createContext } from "react";

type SourceType = "paintings" | "photos";

type MediaSourceContextType = {
  source: SourceType;
  query: string;
  data: { total: number; images: ImageType[]; mock?: boolean } | undefined;
  isLoading: boolean;
  error: Error | null;
  setSource: (source: SourceType) => void;
  setQuery: (q: string) => void;
};

export const MediaSourceContext = createContext<
  MediaSourceContextType | undefined
>(undefined);
