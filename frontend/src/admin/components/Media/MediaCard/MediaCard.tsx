import { useState } from "react"

import { deleteMedia } from "../../../../api/media"
import type { MediaAsset } from "../../../../api/media"
import './MediaCard.css'

interface MediaCardProps {
    media: any;
    currentSelectedId?: number | null;
}

function MediaCard({ media, currentSelectedId = null }: MediaCardProps) {
    const [, setMediaList] = useState<MediaAsset[]>([]);
    const [selectedMediaId, setSelectedMediaId] = useState<number | null>(currentSelectedId);
    
    const handleDelete = async (id: number) => {
        if (!confirm("Удалить навсегда?")) return;
        try {
        await deleteMedia(id);
        setMediaList(prev => prev.filter(m => m.id !== id));
        if (selectedMediaId === id) setSelectedMediaId(null);
        } catch (err) {
        console.error("Ошибка удаления", err);
        alert("Ошибка удаления");
        }
    };
    
    return (
        <div className="media-card">
            <img
                className="imgCard"
                src={`http://localhost:8000${media.url}`}
                alt=""
            />

            <div>
                <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(media.id);
                }}>
                Удалить
                </button>
            </div>
        </div>
    )
}

export default MediaCard