import React, {useState, useContext} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from '@/styles/CoursePlanner.module.css';
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
    <div className={UI.flexWrapperFile}>
      <div className={UI.button}>
        <label className={UI.uiLabel}>
          <input className={UI.input} type="file" value={selectedFile} onInput={handleFilePicked} />
          Sélectionner une sauvegarde Moodle
        </label>
          <Overlay isVisible={isOverlayVisible} visibilityCallback={setIsOverlayVisible}>
              <h2 className={UI.h2}>
                  Entrez les informations correspondant au cours de l'archive importé
              </h2>
              <CourseInformationForm isOldCourse={true}>
              <div className={UI.flexWrapperButton}>
                  <SubmitCourseButton submitCallback={handleCourseInformationSubmit}/>
                  <button onClick={() => setIsOverlayVisible(false)}  className={UI.button}>
                        <div className={UI.uiLabel}>
                            Fermer
                        </div>
                  </button>
              </div>
                  
              </CourseInformationForm>

          </Overlay>
      </div>
    </div>

  );
};

export default FilePickerMBZ;
