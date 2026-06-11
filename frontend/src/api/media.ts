import api from "./client"


export interface MediaAsset {
  id: number;
  storage_key: string;
  url: string;
  mime_type: string;
  created_at: string;
}

export async function getMedia() {
    const response = await api.get("/media/list")
    return response.data
}

export async function getMediaById(id: number) {
    const response = await api.get(`/media/get/${id}`)
    return response.data
}

export async function createMedia(
    file: File,
    name: string
) {

    const formData = new FormData()

    formData.append("file", file)
    formData.append("name", name)

    const response = await api.post(`media/upload`, formData)

    return response.data

}

export async function deleteMedia(id: number) {
    await api.delete(`/media/delete/${id}`)
}