import { useState } from "react"

import { createMedia } from "../../../../api/media"

interface UploadMediaModalProps {
    onClose: () => void
    onSuccess: () => void
}

function UploadMediaModal({
    onClose,
    onSuccess
}: UploadMediaModalProps) {

    const [name, setName] = useState("")
    const [file, setFile] = useState<File | null>(null)

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault()

        if (!file) {
            alert("Выберите файл")
            return
        }

        try {

            await createMedia(
                file,
                name
            )

            onSuccess()
            onClose()

        } catch (error) {

            console.error(error)

        }

    }

    return (

        <div className="modal-overlay">

            <div className="modal-content">

                <h2>
                    Загрузка изображения
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Название файла"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFile(
                                e.target.files?.[0] || null
                            )
                        }
                    />

                    <button type="submit">
                        Загрузить
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                </form>

            </div>

        </div>

    )
}

export default UploadMediaModal