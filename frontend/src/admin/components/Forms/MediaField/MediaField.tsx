import { useState } from "react";

import { MediaLibraryModal } from "../../Media/MediaLibraryModal/MediaLibraryModal";

interface MediaFieldProps {
    value: number | null;
    onChange: (value: number | null) => void;
}

function MediaField({value, onChange}: MediaFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="media-field">

            <div
                className="media-field-box"
                onClick={() =>
                    setIsOpen(true)
                }
            >
                {value
                    ? `Выбрано изображение #${value}`
                    : "Выбрать изображение"}
            </div>

            <MediaLibraryModal
                isOpen={isOpen}
                onClose={() =>
                    setIsOpen(false)
                }
                onSelect={(id) => {
                    onChange(id)
                    setIsOpen(false)
                }}
                currentSelectedId={value}
            />

        </div>
    )
}

export default MediaField;