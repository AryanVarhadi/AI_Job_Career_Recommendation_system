import React from "react";

function SummeryPreview({ resumeInfo }) {
  return (
    <div className="my-4">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Summary
      </h2>

      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      <p className="text-xs mt-2">
        {resumeInfo?.summery ||
          "Write a short professional summary about yourself."}
      </p>
    </div>
  );
}

export default SummeryPreview;
