import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import EventCalendar from '@/components/view/eventCalendar'
import CourseInformationForm from '@/components/view/courseInformationForm'
import {CalController} from '@/components/controller/calController'
import ClearCalButton from '@/components/view/clearCalButton'
import {CalModel} from '@/components/model/calModel'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Course Planner</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <CalModel>
            <CalController>
              <EventCalendar />
              <CourseInformationForm />
              <ClearCalButton />
            </CalController>
          </CalModel>
        </div>
      </main>
    </>
  )
}
