import axios from "axios"
import api from "./client"


const API_URL = "http://localhost:8000/api/v1"

export async function getPlayers() {
    const response = await fetch(`${API_URL}/players`)

    if (!response.ok) {
        throw new Error("Ошибка загрузки игроков")
    }

    return response.json()
}

export async function getPlayer(slug: string) {

    const response = await fetch(
        `${API_URL}/players/${slug}`
    )

    if (!response.ok) {
        throw new Error("Игрок не найден")
    }

    return response.json()
}


export async function createPlayer(
    playerData: any
) {
    const response = await api.post('/players', playerData)
    return response.data

}

export async function updatePlayer(
    id: number,
    playerData: any
) {
    const token = localStorage.getItem("token")

    const response = await axios.patch(
        
        `${API_URL}/players/${id}`,

        playerData,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export async function updatePlayerStatistic(statisticId: number, data: {
  season_id?: number;
  matches_played: number;
  sets_played: number;
  total_points: number;
  blocks: number;
  attacks: number;
  aces: number;
  errors: number;
}) {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_URL}/player-statistic/${statisticId}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function addToPlayerStatistic(statisticId: number, delta: {
  matches_played?: number;
  sets_played?: number;
  total_points?: number;
  blocks?: number;
  attacks?: number;
  aces?: number;
  errors?: number;
}) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/player-statistic/add/${statisticId}`,
    delta,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
