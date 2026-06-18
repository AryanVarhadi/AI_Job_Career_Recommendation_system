import React from "react";

function EducationalPreview({ resumeInfo }) {
  const educationList = resumeInfo?.education || [];

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Education
      </h2>

      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {educationList.map((education, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {education?.universityName || "University Name"}
          </h2>

          <h2 className="text-xs flex justify-between">
            {education?.degree || "Degree"} in {education?.major || "Major"}
            <span>
              {education?.startDate || "Start"} - {education?.endDate || "End"}
            </span>
          </h2>

          <p className="text-xs my-2">
            {education?.description || "Description"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;
