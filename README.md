

## Getting Started


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
## Architecture
This application is running on static single page. It is designed to be deployed on serverless hoster. This means that all of the code must run in the browser. It also means that our architecture is heavily influenced by the front-end framework that the application uses (which is next.js). Since all the logic will be stored in the client-side code, without proper organization the code base is at rick of becoming extremely chaotic, unpractial and hard to maintain. To prevent this we opted for a MVC design. React is not meant to build MVC applications so our architecture diagram will seem a little unusual.

![img unavailable](/docs/architecture/component_mvc.svg "General architecture diagram") 

We used react's contexts to expose a component's functions or data. For example, the CalModel component, who has the role of holding the in-memory collections of data and saving it to the local store when it changes, creates a context when used in a DOM tree. This context will expose the events data collection and the setEvents function handle. Children of this component will have access to the elements exposed by the context provider. The same logic applies to the controller who designed to be the child of CalModel. This relation will allow CalController to access CalModel context but will not permit CalModel to access CalController context. With this architecture, and react functionality, when ClearCalButton notifies CalController of a button push by calling it's notifyClearEvents function, CalController will only have to use the setEvents function handle of CalModel with an empty collection and the state of the object will be automatically synchronized with everyone who uses it (EventCalendar in this example). Note that this diagram is not exhaustive and that its purpose is only to illustrate the general architecture of the application and the interactions between its components. If we were to translate this diagram into a more conventional form by not representing the context interaction, we will get the more traditional-looking diagram: 

![img unavailable](/docs/architecture/translated_mvc.svg "General architecture diagram")

## Moodle step by step

The following section will guide you through using the application to modify the dates of activities in a Moodle course.

> Because this tool modifies a backup file that will later be used to restore (and overwrite) activities in the course, it is highly recommended that you use this tool *before* students are enrolled in the course (and have begun activities).
> **Use at your own risk!**  
> Note: these instructions may be different depending on your version of Moodle.
> This tool was tested with Moodle version 3.x.
> Please see the documentation for the various steps according to your version of Moodle.

### Step 1. Create a Moodle backup file

The first thing to do is to create a Moodle backup file.
This can be done through the Moodle UI.
You must have the teacher role in a course to do so.

To create the file, go to your Moodle class.
Use the cogwheel at the top right of your screen and click "Backup".
You can then click "Jump to final step" to export it or configure your exportation settings accordingly. 

![Moodle Cogwheel](images/cogwheel_moodle.png)
![Moodle Export](images/export_moodle.png)

After it finishes, you can press "Continue".
You should see your backup Moodle file in the "User private backup area" section.
Download the file and save it on your computer.

![Moodle backup](images/backup_file_moodle.png)

