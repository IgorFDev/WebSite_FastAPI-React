import { useEffect, useState } from "react"
import { getMedia } from "../../../api/media"

import MediaGrid from "../../components/Media/MediaGrid/MediaGrid"
import UploadMediaModal from "../../components/Media/MediaUpload/UploadMediaModal"
import './MediaLibraryPage.css'

function MediaLibraryPage() {
    const [media, setMedia] = useState([])

    useEffect(() => {

        loadMedia()

    }, [])

    async function loadMedia() {
        try {
            const data = await getMedia()

            setMedia(data)
        } catch (error) {
            console.error(error)
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="media-library-container">

            <div className="media-library-header">

                <h1>Медиатека</h1>

                <button onClick={() => setIsModalOpen(true)}>
                    Загрузить файл
                </button>

            </div>

            <MediaGrid media={media} />
            
            {isModalOpen && (
                <UploadMediaModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false)
                        loadMedia()
                    }}
                />
            )}

        </div>
    )
}

export default MediaLibraryPage