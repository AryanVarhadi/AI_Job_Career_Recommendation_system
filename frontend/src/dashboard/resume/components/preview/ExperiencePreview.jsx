import React from "react";

function ExperiencePreview({ resumeInfo }) {
  const experienceList = resumeInfo?.Experience || [];

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>

      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {experienceList.map((experience, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {experience?.title || "Job Title"}
          </h2>

          <h2 className="text-xs flex justify-between">
            {experience?.companyName || "Company"}, {experience?.city || "City"}
            , {experience?.state || "State"}
            <span>
              {experience?.startDate || "Start"} -{" "}
              {experience?.endDate || "End"}
            </span>
          </h2>

          <p className="text-xs my-2">
            {experience?.workSummery || "Work description"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
