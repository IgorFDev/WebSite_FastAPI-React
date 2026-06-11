/* import api from "./client" */

const API_URL = "http://localhost:8000/api/v1"

export async function getTournamentTeams() {
    const response = await fetch(`${API_URL}/tournament-team/`)

    if (!response.ok) {
        throw new Error("Ошибка загрузки турнирных команд")
    }

    return response.json()
}