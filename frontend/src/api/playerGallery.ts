import api from "./client";

export interface PlayerGalleryItem {
  id: number;
  player_id: number;
  media_asset: {
    id: number;
    url: string;
    storage_key: string;
    mime_type: string;
  };
  sort_order: number;
}

export async function getPlayerGallery(playerId: number): Promise<PlayerGalleryItem[]> {
  const response = await api.get(`/player-gallery/${playerId}`);
  return response.data;
}

export async function addGalleryItem(data: {
  player_id: number;
  media_asset_id: number;
  sort_order: number;
}) {
  const response = await api.post("/player-gallery/", data);
  return response.data;
}

export async function deleteGalleryItem(playerGalleryId: number) {
  await api.delete(`/player-gallery/${playerGalleryId}`);
}

export async function updateGalleryItem(
  playerGalleryId: number,
  data: { sort_order?: number; media_asset_id?: number }
) {
  const response = await api.patch(`/player-gallery/${playerGalleryId}`, data);
  return response.data;
}