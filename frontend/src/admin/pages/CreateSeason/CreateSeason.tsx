import { useState } from "react"

import { createSeason } from "../../../api/seasons"

function CreateSeason() {
    const [name, setName] = useState("")
    const [isCurrent, setIsCurrent] = useState(false)
    const [message, setMessage] = useState("")

        async function handleSubmit(
            e: React.FormEvent
        ) {
            e.preventDefault()
            
            try {
                await createSeason({
                    name,
                    is_current: isCurrent
                })
                setMessage("Season created successfully")
            } catch (error: any) {
                console.error('Ошибка валидации:', error.response?.data);
                setMessage(`Ошибка: ${JSON.stringify(error.response?.data?.detail)}`);
            }
        }
    
    return (
        <div>
            <h1>Create Season</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Season name" 
                />
                <input 
                    type="checkbox" 
                    checked={isCurrent} 
                    onChange={(e) => setIsCurrent(e.target.checked)} 
                />
                <button type="submit">Create Season</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default CreateSeason
