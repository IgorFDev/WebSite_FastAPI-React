import type { ReactNode } from "react"
import "./UniversalModal.css"

interface UniversalModalProps {
    title: string
    children: ReactNode
    onClose: () => void
}


function UniversalModal({
    title,
    children,
    onClose
}: UniversalModalProps) {
    return (
        <div className="modal-overlay">

            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    )
}

export default UniversalModal