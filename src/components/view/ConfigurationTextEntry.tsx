import React from 'react';
import UI from "@/styles/CoursePlanner.module.css";

interface TextEntryProps {
    text: string
    
}

const ConfigurationTextEntry: React.FC<TextEntryProps> = ({text }) => {

  

    return (
        <div>

            <textarea className={UI.textInsideDSL} value={text} />
            
        </div>
    );
};

export default ConfigurationTextEntry;
