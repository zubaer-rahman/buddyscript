import { EntityType } from "@shared/types";
import { useMutation } from "@tanstack/react-query";
import { toggleLike } from "../api/likesApi";

export function useLikeMutation() {
  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
    }: {
      entityType: EntityType;
      entityId: number;
    }) => toggleLike(entityType, entityId),
  });
}
