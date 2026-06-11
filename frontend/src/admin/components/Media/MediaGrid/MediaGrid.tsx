import MediaCard from "../MediaCard/MediaCard"
import './MediaGrid.css'

interface MediaGridProps {
    media: any[]
}

function MediaGrid({ media }: MediaGridProps) {
    return (
        <div className="media-grid">
            {media.map((item) => (
                <MediaCard
                    key={item.id}
                    media={item}
                />
            ))}
        </div>
    )
}

export default MediaGrid