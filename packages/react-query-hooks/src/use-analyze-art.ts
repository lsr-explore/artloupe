// packages/react-query-hooks/src/useAnalyzeArt.ts

import { postAnalyzeArt } from '@artloupe/api-fetchers';
import type { ImageType } from '@artloupe/shared-types';
import { useMutation } from '@tanstack/react-query';

export const useAnalyzeArt = () => {
  return useMutation({
    mutationFn: (artwork: ImageType) => postAnalyzeArt(artwork),
  });
};
