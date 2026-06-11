import api from "./client";

export async function updatePlayerStatistic(
  statisticId: number,
  data: {
    season_id: number;
    matches_played: number;
    sets_played: number;
    total_points: number;
    blocks: number;
    attacks: number;
    aces: number;
    errors: number;
  }
) {
  const response = await api.patch(`/player-statistic/${statisticId}`, data);
  return response.data;
}

export async function addToPlayerStatistic(
  statisticId: number,
  delta: {
    matches_played?: number;
    sets_played?: number;
    total_points?: number;
    blocks?: number;
    attacks?: number;
    aces?: number;
    errors?: number;
  }
) {
  const response = await api.post(`/player-statistic/add/${statisticId}`, delta);
  return response.data;
}