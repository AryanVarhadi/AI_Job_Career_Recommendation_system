import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{ color: resumeInfo?.themeColor }}
      >
        {resumeInfo?.firstName || "First Name"}{" "}
        {resumeInfo?.lastName || "Last Name"}
      </h2>

      <h2 className="text-center text-sm font-medium">
        {resumeInfo?.jobTitle || "Job Title"}
      </h2>

      <h2
        className="text-center font-normal text-xs"
        style={{ color: resumeInfo?.themeColor }}
      >
        {resumeInfo?.address || "Address"}
      </h2>

      <div className="flex justify-between mt-2">
        <h2
          className="font-normal text-xs"
          style={{ color: resumeInfo?.themeColor }}
        >
          {resumeInfo?.phone || "Phone"}
        </h2>

        <h2
          className="font-normal text-xs"
          style={{ color: resumeInfo?.themeColor }}
        >
          {resumeInfo?.email || "Email"}
        </h2>
      </div>

      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor }}
      />
    </div>
  );
}

export default PersonalDetailPreview;
