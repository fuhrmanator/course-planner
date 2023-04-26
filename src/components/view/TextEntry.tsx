import React from 'react';
import UI from "@/styles/CoursePlanner.module.css";

interface TextEntryProps {
    text: string
    onChange:(text: string) => void;
    onSubmit: (text: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({text, onChange, onSubmit }) => {

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(text);
    };

    return (
        <div>

            <textarea className={UI.textInsideDSL} value={text} onChange={handleTextChange} />
            <button onClick={handleSubmit} className={UI.button}>
                <div className={UI.uiLabel}>
                    Envoyer
                </div>
            </button>
        </div>
    );
};

export default TextEntry;
