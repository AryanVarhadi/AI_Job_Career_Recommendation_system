import React from "react";

function SkillsPreview({ resumeInfo }) {
  const skillsList = resumeInfo?.skills || [];

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2 uppercase tracking-wide"
        style={{ color: resumeInfo?.themeColor }}
      >
        Skills
      </h2>

      <hr className="mb-4" style={{ borderColor: resumeInfo?.themeColor }} />

      {/* 🔥 FIX: grid instead of flex */}
      <div className="space-y-4">
        {skillsList.map((skill, index) => (
          <div key={index}>
            {/* 🔥 FIX: stable layout */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium break-words max-w-[80%]">
                {skill?.name || "Skill"}
              </span>

              <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                {skill?.rating}/5
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-2 rounded"
                style={{
                  width: `${(skill?.rating || 0) * 20}%`,
                  backgroundColor: resumeInfo?.themeColor || "#000",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;
