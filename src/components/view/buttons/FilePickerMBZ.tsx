import React, {useState, useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';

interface Props {}

const FilePickerMBZ: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const {notifyMBZSubmitted} = useContext(EventControllerContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.value !== "") {
      setSelectedFile(event.target.value);
      notifyMBZSubmitted(event.target.files[0]);
    }
  };

  const handleFocus = () => {
    setSelectedFile("");
  }

  return (
      <label className={UI.button}>
        <input className={UI.input} type="file" value={selectedFile} onFocus={handleFocus} onInput={handleFileChange} />
        Sélectionner un fichier
      </label>

  );
};

export default FilePickerMBZ;
