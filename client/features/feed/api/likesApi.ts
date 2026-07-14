import api from "@lib/axios";
import { EntityType } from "@shared/types";

export async function toggleLike(entityType: EntityType, entityId: number) {
  const response = await api.post("/like/toggle", { entityType, entityId });
  return response.data;
}
