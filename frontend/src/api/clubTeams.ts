import api from "./client"

const API_URL = "http://localhost:8000/api/v1/club-team/"

export async function getClubTeams() {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Ошибка загрузки команд клуба")
    }

    return response.json()
}

export async function createClubTeam(data: any) {
    const response = await api.post("/club-team", data)
    return response.data
}

export async function updateClubTeam(id: number, data: any) {
    const response = await api.patch(`/club-team/${id}`, data)
    return response.data
}

export async function deleteClubTeam(id: number) {
    const response = await api.delete(`/club-team/${id}`)
    return response.data
}
