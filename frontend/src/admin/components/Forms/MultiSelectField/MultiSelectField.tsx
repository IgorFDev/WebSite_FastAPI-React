import { useState } from "react";
import "./MultiSelectField.css";

interface MultiSelectFieldProps {
    value: number[];
    onChange: (value: number[]) => void;
    options: { value: number; label: string }[];
    label?: string;
}

function MultiSelectField({ value, onChange, options, label }: MultiSelectFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (optionValue: number) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const selectedLabels = options
        .filter(option => value.includes(option.value))
        .map(option => option.label)
        .join(", ");

    return (
        <div className="multiselect-field">
            <div
                className="multiselect-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedLabels || "Выберите категории"}
                <span className={`multiselect-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>
            
            {isOpen && (
                <div className="multiselect-dropdown">
                    {options.map((option) => (
                        <div key={option.value} className="multiselect-option">
                            <label className="multiselect-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={value.includes(option.value)}
                                    onChange={() => toggleOption(option.value)}
                                />
                                <span>{option.label}</span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelectField;
