import React, {useState, useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';

interface Props {}

const FilePickerMBZ: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const {notifyMBZSubmitted} = useContext(EventControllerContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("change")
    if (event.target.files != null && event.target.value !== "") {

      notifyMBZSubmitted(event.target.files[0]);
      setSelectedFile("");
    }
  };

  return (
      <div className={UI.uiLabel}>
        <label className={UI.button}>
          <input className={UI.input} type="file" value={selectedFile} onInput={handleFileChange} />
          Sélectionner un fichier
        </label>
      </div>

  );
};

export default FilePickerMBZ;
