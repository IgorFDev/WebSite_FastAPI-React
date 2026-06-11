import api from "./client"

const API_URL = "http://localhost:8000/api/v1/seasons/"

export async function getSeasons() {
    const response = await fetch(API_URL)
    return response.json()
}

export async function createSeason(
    seasonData: any
) {
    const response = await api.post("/seasons", seasonData)
    return response.data
}

export async function updateSeason(
    id: number,
    seasonData: any
) {
    const response = await api.patch(`/seasons/${id}`, seasonData)
    return response.data
}

export async function deleteSeason(
    id: number
) {
    const response = await api.delete(`/seasons/${id}`)
    return response.data
}
