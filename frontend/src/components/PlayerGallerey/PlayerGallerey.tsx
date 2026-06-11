import './PlayerGallerey.css'

interface GalleryItem {
    id: number
    media_asset: {
        id: number
        storage_key: string
        url: string
        mime_type: string
    }
}

interface GalleryProps {
    galleryItems: GalleryItem[]
}

function PlayerGallerey({ galleryItems }: GalleryProps) {
    if (galleryItems.length === 0) {
        return null
    }
    
    return (
        <div className="player-galery">
            
            <h2 className="player-galery__title">
                Галерея
            </h2>
            
            <div className="player-galery__grid-items">

                {galleryItems.map((item) => (
                    
                    <div key={item.id} className="player-galery__item">
                        <img src={`http://127.0.0.1:8000${item.media_asset.url}`} alt={item.media_asset.mime_type} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayerGallerey