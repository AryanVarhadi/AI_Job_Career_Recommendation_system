import { createContext } from "react";

export const ResumeInfoContext = createContext({
  resumeInfo: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    summery: "",
    Experience: [],
    education: [],
    skills: [],
    themeColor: "#000",
  },
  setResumeInfo: () => {},
});
