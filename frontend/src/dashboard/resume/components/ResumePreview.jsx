import React from "react";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummeryPreview from "./preview/SummeryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillsPreview from "./preview/SkillsPreview";

function ResumePreview({ resumeInfo }) {
  if (!resumeInfo) return null;

  return (
    <div
      id="resume-content" // 🔥 MOST IMPORTANT (PDF target)
      className="bg-white mx-auto"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        borderTop: `20px solid ${resumeInfo?.themeColor || "#000"}`,
      }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <SummeryPreview resumeInfo={resumeInfo} />
      <ExperiencePreview resumeInfo={resumeInfo} />
      <EducationalPreview resumeInfo={resumeInfo} />
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
}

export default ResumePreview;
