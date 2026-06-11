import { useState, useEffect } from "react"
import "./UniversalForm.css"
import MediaField from "../../Forms/MediaField/MediaField"

interface UniversalFormProps {
    fields: any[]
    initialData?: any
    onSubmit?: (data: any) => void
    
}

function UniversalForm({
    fields,
    initialData,
    onSubmit
}: UniversalFormProps) {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])
    
    function handleChange(
        name: string,
        value: any
    ) {

        const newData = {
            ...formData,
            [name]: value
        }

        console.log("Изменено поле:")
        console.log({
            [name]: value
        })

        console.log("Текущая форма:")
        console.log(newData)

        setFormData(newData)


        // setFormData(prev => ({
        //     ...prev,
        //     [name]: value
        // }))
    }

    function validateForm() {

        const newErrors: Record<string, string> = {}

        fields.forEach((field) => {
            if (!field.required) {
                return
            }

            const value = formData[field.name]

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                newErrors[field.name] =
                    "Поле обязательно"
            }
        })

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0

    }

    function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault()

        if (!validateForm()) {
            return
        }

        onSubmit(formData)
    }

    return (
        <form className="universal-form" onSubmit={(e) => {
            handleSubmit(e)
        }}>
            {fields.map((field) => (
                
                <div className="form-field" key={field.name}>

                <div className="form-label">
                    {field.label}
                </div>

                {field.type === "text" && (
                    <input
                        className="form-input"
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                    />
                )}

                {field.type === "select" && (
                    <select 
                        className="form-select"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                    >

                        {field.options?.map((option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        ))}

                    </select>
                )}

                {field.type === "number" && (
                    <input
                        className="form-input"
                        type="number"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                        onWheel={(e) => {
                            e.currentTarget.blur()
                        }}
                    />
                )}
                
                {field.type === "media" && (
                    <MediaField
                        value={formData[field.name] || null}
                        onChange={(mediaId) =>
                            handleChange(
                                field.name,
                                mediaId
                            )
                        }
                    />
                )}

                {field.type === "textarea" && (
                    <textarea
                        className="form-input"
                        rows={5}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                    />
                )}

                {field.type === "date" && (
                    <input
                        className="form-input"
                        type="date"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                    />
                )}

                {field.type === "datetime" && (
                    <input
                        className="form-input"
                        type="datetime-local"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.value
                            )
                        }
                    />
                )}

                {field.type === "checkbox" && (
                    <input
                        className="form-checkbox"
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name] || false}
                        onChange={(e) =>
                            handleChange(
                                field.name,
                                e.target.checked
                            )
                        }
                    />
                )}

                {/* Error message */}
                {errors[field.name] && (
                    <p className="form-error">
                        {errors[field.name]}
                    </p>
                )}

                </div>
            ))}
            <button className="form-submit-button" type="submit">
                Отправить
            </button>
        </form>
    )
}

export default UniversalForm
