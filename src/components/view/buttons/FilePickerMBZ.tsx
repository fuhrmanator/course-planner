import React, {useState, useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';
import ShowOverlay from "@/components/view/buttons/ShowOverlay";
import Overlay from "@/components/view/Overlay";
import CourseInformationForm from "@/components/view/CourseInformationForm";
import SubmitCourseButton from "@/components/view/buttons/SubmitCourseButton";

interface Props {}

const FilePickerMBZ: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);

  const {notifyMBZSubmitted} = useContext(EventControllerContext);

  const handleCourseInformationSubmit = () => {
      setIsOverlayVisible(false);
  }
  const handleFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.value !== "") {
      notifyMBZSubmitted(event.target.files[0]);
      setSelectedFile("");
      setIsOverlayVisible(true);
    }
  };

  return (
      <div className={UI.uiLabel}>
        <label className={UI.button}>
          <input className={UI.input} type="file" value={selectedFile} onInput={handleFilePicked} />
          Sélectionner un fichier
        </label>
          <Overlay isVisible={isOverlayVisible} visibilityCallback={setIsOverlayVisible}>
              <p>
                  Entrez les informations correspondant au cours de l'archive importé
              </p>
              <CourseInformationForm isOldCourse={true}>
                  <SubmitCourseButton submitCallback={handleCourseInformationSubmit}/>
              </CourseInformationForm>
          </Overlay>
      </div>

  );
};

export default FilePickerMBZ;
