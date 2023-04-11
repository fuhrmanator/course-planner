import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import EventCalendar from '@/components/view/EventCalendar'
import CourseInformationForm from '@/components/view/CourseInformationForm'
import {EventController} from '@/components/controller/eventController'
import ClearCalButton from '@/components/view/buttons/ClearCalButton'
import {EventModel} from '@/components/model/EventModel'
import FilePickerMBZ from '@/components/view/buttons/FilePickerMBZ'
import DownloadMBZButton from '@/components/view/buttons/DownloadMBZButton'
import ShowSuggestionConfigOverlay from "@/components/view/suggestion/ShowSuggestionConfigOverlay";
import SuggestionButton from "@/components/view/buttons/SuggestionButton";
import SaveAllChangesButton from "@/components/view/buttons/SaveAllChangesButton";
import CancelChangesButton from "@/components/view/buttons/CancelChangesButton";
import ShowOverlay from "@/components/view/buttons/ShowOverlay";
import SuggestionConfig from "@/components/view/suggestion/SuggestionConfig";
import DSLWindow from "@/components/view/DSLWindow";
import ShowEventsByType from '@/components/view/editEvents/ShowEventsByType'
import UI from '@/styles/CoursePlanner.module.css'
import SubmitCourseButton from "@/components/view/buttons/SubmitCourseButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>Course-Planner</title>
        <meta name="description" content="Projet du PFE 030 de l'ETS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <EventModel>
            <EventController>


              <div className={[UI.split, UI.right].join(' ')}>
                <ShowEventsByType/>

                <div className={styles.grid}>
                  <ShowOverlay label={"Configurer la suggestion"}>
                    <SuggestionConfig />
                  </ShowOverlay>
                  <SuggestionButton />
                  <SaveAllChangesButton />
                  <CancelChangesButton />
                </div>

                <div className={UI.flexWrapperFile}>
                <h3 className={UI.uiLabel}>Options Avancées: </h3>
                <ShowOverlay label={"DSL"}>
                  <DSLWindow />
                </ShowOverlay>
                </div>

                <div className={[UI.split, UI.left].join(' ')}>
                  <EventCalendar />
                  <div className={UI.flexWrapperFile}>
                    <FilePickerMBZ />
                  </div>
                  <CourseInformationForm isOldCourse={false}>
                    <SubmitCourseButton />
                  </CourseInformationForm>

                  <div className={UI.flexWrapperButton}>
                    <ClearCalButton />
                    <DownloadMBZButton />
                  </div>
                </div>

              </div>

            </EventController>
          </EventModel>
        </div>
      </main>
    </>
  )
}
