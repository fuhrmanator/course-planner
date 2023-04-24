import React, {createContext, useContext, useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {EventControllerContext} from "@/components/controller/EventController";
import {getValue, setValue} from 'src/components/model/localStore'
import UI from "@/styles/CoursePlanner.module.css";
import typeStyles from "@/components/view/style/ShowEventsByType.module.css";

enum Session {
  Winter = 1,
  Summer = 2,
  Fall = 3
}

export const CODE_STORE_KEY = 'code';
export const GROUP_STORE_KEY = 'group';
export const YEAR_STORE_KEY = 'year';
export const SESSION_STORE_KEY = 'session';

type CourseInformationContextProps = {
    handleSubmit : () => void,
    isFormValid: boolean;
}

export const CourseInformationContext = createContext<CourseInformationContextProps>({} as CourseInformationContextProps);

type CourseInformationProps = {
    children: React.ReactNode;
    isOldCourse:boolean

}
/**

 A form component that allows the user to input course information.
 This component uses antd form components and is connected to the EventControllerContext
 to notify the application of form submission.
 @component
 @example
 <CourseInformationForm />
 @returns {JSX.Element} - Rendered component.
 */
const CourseInformationForm: React.FC<CourseInformationProps> = ({children, isOldCourse}) => {
    const [code, setCode] = useState<string>("");
    const [group, setGroup] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [session, setSession] = useState<number>(Session.Fall);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [errorMsg, setErrorMSg] = useState<string>("");
    useEffect(()=>{
      setCode(getValue(CODE_STORE_KEY, '""'));
      setGroup(getValue(GROUP_STORE_KEY, 1));
      setYear(getValue(YEAR_STORE_KEY, new Date().getFullYear()));
      setSession(getValue(SESSION_STORE_KEY, Session.Fall));
    },[]);

    useEffect(()=>{
        setIsFormValid(code !== "" && group > 0 && year > 0)
        setErrorMSg("");
    },[code, group, year, session]);

    const {notifyCourseFormSubmit} = useContext(EventControllerContext);

    const handleSubmit = async () => {
        try {
            await notifyCourseFormSubmit(code, group, year, session, isOldCourse);
            setValue(CODE_STORE_KEY, code);
            setValue(GROUP_STORE_KEY, group);
            setValue(YEAR_STORE_KEY, year);
            setValue(SESSION_STORE_KEY, session);
            setErrorMSg("");
            return false;
        } catch (e:any) {
            if (typeof e.message !== "undefined")
                setErrorMSg(e.message);
        }
    };



  return (
      <CourseInformationContext.Provider value={{handleSubmit, isFormValid}}>
          <div className={UI.formUI}>
            <Form onFinish={handleSubmit}>
              <Form.Item label="Sigle">
                <Input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  type="text"
                />
              </Form.Item>
              <Form.Item label="Groupe">
                <Input
                  value={group}
                  onChange={e => setGroup(parseInt(e.target.value))}
                  type="number"
                />
              </Form.Item>
              <Form.Item label="Année">
                <Input
                  value={year}
                  onChange={e => setYear(parseInt(e.target.value))}
                  type="number"
                />
              </Form.Item>
              <Form.Item label="Session">
                <Select
                  value={session}
                  onChange={setSession}
                  style={{ width: 120 }}
                >
                  <Select.Option value={Session.Winter}>Hiver</Select.Option>
                  <Select.Option value={Session.Summer}>Été</Select.Option>
                  <Select.Option value={Session.Fall}>Automne</Select.Option>
                </Select>
              </Form.Item>
            </Form>
              <p className={typeStyles.error}>{errorMsg}</p>
              {children}
          </div>
      </CourseInformationContext.Provider>
  );
};

export default CourseInformationForm;