import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "@/service/GlobalApi"; // 🔥 ADD

function EditResume() {
  const { resumeId } = useParams();

  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM DATABASE (AUTO-FILL FIX)
  useEffect(() => {
    if (resumeId) {
      GetResumeData();
    }
  }, [resumeId]);

  const GetResumeData = async () => {
    try {
      const res = await GlobalApi.GetResumeById(resumeId);

      console.log("Fetched Resume:", res.data);

      setResumeInfo(res.data);

      // 🔥 IMPORTANT: store id for update
      localStorage.setItem("resumeId", res.data._id);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // 🔥 AUTO SAVE (LOCAL PREVIEW ONLY - OPTIONAL)
  useEffect(() => {
    if (resumeInfo) {
      localStorage.setItem("resumeData", JSON.stringify(resumeInfo));
    }
  }, [resumeInfo]);

  // 🔥 LOADING UI
  if (loading || !resumeInfo) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold animate-pulse">
          Loading Resume...
        </h2>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-gray-50 min-h-screen">
        {/* LEFT: FORM */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FormSection />
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ResumePreview resumeInfo={resumeInfo} />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
