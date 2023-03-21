interface RadioButtonProps {
    labelTrue: string;
    labelFalse: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ labelTrue, labelFalse, value, onChange }) => {
    const handleChange = () => {
        onChange(!value);
    };

    return (
        <div>
                <label>
                <input type="radio" checked={value} onChange={handleChange} />
                {labelTrue}
                </label>
                <label>
                <input type="radio" checked={!value} onChange={handleChange} />
                {labelFalse}
                </label>
        </div>
    );
};
export default RadioButton;