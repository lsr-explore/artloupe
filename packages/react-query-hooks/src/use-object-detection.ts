import { postDetectObjects } from "@artloupe/api-fetchers";
import { useMutation } from "@tanstack/react-query";

export const useDetectObjects = () => {
  return useMutation({
    mutationFn: (imageData: ArrayBuffer) => postDetectObjects(imageData),
  });
};
