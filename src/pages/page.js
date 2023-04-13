// Overlay use className props to pass style properties to child component.
// To make this component work add className props to your child component manually.
// Here an example: https://gist.github.com/Miniplop/8f87608f8100e758fa5a4eb46f9d151f

import React from "react";
import {
    AcronymComboBox,
    ActivityResetButton,
    ActivitySaveButton,
    AllFilter,
    CourseCalendar,
    CourseResetButton,
    EvaluationFilter,
    ExportButton,
    GroupComboBox,
    HomeworkFilter,
    ImportButton,
    SelectButton,
    SendButton,
    SuggestionButton,
    YearComboBox
} from "components";
import styles from "./CoursePlanner.module.css";

const CoursePlanner = () => {
    return (
        <div className={styles.coursePlanner}>
            <div className={styles.flexWrapperOne}>
                <div className={styles.flexWrapperNine}>
                    <CourseCalendar
                        className={styles.courseCalendar}
                    />
                    <div className={styles.flexWrapperEleven}>
                        <p className={styles.importLabel}>Importer</p>
                        <div className={styles.importDropdownMenu} />
                    </div>
                </div>
                <div className={styles.flexWrapperTen}>
                    <div className={styles.flexWrapperTwelve}>
                        <AllFilter className={styles.allFilter} />
                        <EvaluationFilter
                            className={styles.evaluationFilter}
                        />
                        <HomeworkFilter className={styles.allFilter} />
                    </div>
                    <div className={styles.activityListBox} />
                </div>
            </div>
            <div className={styles.flexWrapperTwo}>
                <SelectButton className={styles.selectButton} />
                <ImportButton className={styles.selectButton} />
            </div>
            <div className={styles.flexWrapperThree}>
                <div className={styles.universityDropdownMenu} />
                <p className={styles.activityLabel}>
                    Activité sélectionnée:{" "}
                </p>
            </div>
            <div className={styles.flexWrapperFour}>
                <p className={styles.acronymLabel}>Sigle:</p>
                <AcronymComboBox
                    className={styles.acronymComboBox}
                />
                <p className={styles.startLabel}>Début</p>
            </div>
            <div className={styles.flexWrapperFive}>
                <p className={styles.groupLabel}>Groupe:</p>
                <GroupComboBox className={styles.groupComboBox} />
                <div className={styles.startActivityDropdownMenu} />
                <div className={styles.startdfDropdownMenu} />
                <div className={styles.startAjustDropdownMenu} />
                <p className={styles.startTimeLabel}>
                    Heure/minute: 00:00{" "}
                </p>
            </div>
            <div className={styles.flexWrapperSix}>
                <p className={styles.groupLabel}>Année:</p>
                <YearComboBox className={styles.yearComboBox} />
                <div className={styles.flexWrapperThirteen}>
                    <p className={styles.endLabel}>Fin</p>
                    <div className={styles.importDropdownMenu} />
                </div>
                <div className={styles.enddfDropdownMenu} />
                <div className={styles.endAjustDropdownMenu} />
                <p className={styles.endTimeLabel}>
                    Heure/minute: 00:00{" "}
                </p>
            </div>
            <div className={styles.flexWrapperSeven}>
                <p className={styles.semesterLabel}>Session:</p>
                <div className={styles.semesterDropdownMenu} />
                <p className={styles.relativeTimeLabel}>
                    Temps relatif
                </p>
                <div className={styles.relativeTimeRadioBox} />
                <p className={styles.relativeTimeLabel}>
                    Temps absolu
                </p>
                <div className={styles.relativeTimeRadioBox} />
            </div>
            <div className={styles.flexWrapperEight}>
                <div className={styles.flexWrapperFourteen}>
                    <div className={styles.flexWrapperFifteen}>
                        <p className={styles.importedCourseLabel}>
                            Cours Importé
                        </p>
                        <div
                            className={styles.importedCourseRadioBox}
                        />
                        <p className={styles.newCourseLabel}>
                            Nouveau Cours
                        </p>
                    </div>
                    <div className={styles.flexWrapperSixteen}>
                        <SendButton className={styles.sendButton} />
                        <CourseResetButton
                            className={styles.courseResetButton}
                        />
                        <ExportButton className={styles.sendButton} />
                    </div>
                </div>
                <div className={styles.newCourseRadioBox} />
                <ActivitySaveButton
                    className={styles.activitySaveButton}
                />
                <ActivityResetButton
                    className={styles.activityResetButton}
                />
                <SuggestionButton
                    className={styles.suggestionButton}
                />
            </div>
        </div>
    );
};

export default CoursePlanner;