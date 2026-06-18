import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import GlobalApi from "@/service/GlobalApi";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const { resumeId } = useParams();
  const navigate = useNavigate();

  // 🔥 FETCH RESUME
  useEffect(() => {
    if (!resumeId) return;

    GlobalApi.GetResumeById(resumeId)
      .then((res) => setResumeInfo(res.data))
      .catch((err) => console.log(err));
  }, [resumeId]);

  // 🔥 CLEAN PDF DOWNLOAD (NO EXTRA PAGE + PERFECT A4)
  const handleDownload = async () => {
    setDownloading(true);

    const element = document.getElementById("resume-content");

    if (!element) {
      setDownloading(false);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 3, // 🔥 better quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // FIRST PAGE
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // MULTI PAGE (FIXED BLANK PAGE ISSUE)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("My_Resume.pdf");
    setDownloading(false);
  };

  // 🔥 LOADING
  if (!resumeInfo) {
    return (
      <div className="p-10 text-center dark:text-white">
        <h2 className="text-xl animate-pulse">Loading Resume...</h2>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      {/* 🔥 PAGE WRAPPER (DARK MODE FIX) */}
      <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] transition">
        {/* HEADER */}
        <div id="no-print" className="text-center py-10">
          <h2 className="text-2xl font-bold dark:text-white">
            Your Resume is Ready!
          </h2>

          {/* BUTTONS */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <Button onClick={handleDownload}>
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>

            <Button onClick={() => navigate(`/recommendations/${resumeId}`)}>
              Analyze Resume & Get Job Recommendations
            </Button>
          </div>
        </div>

        {/* 🔥 RESUME SECTION (PRO LOOK) */}
        <div id="resume-print" className="flex justify-center pb-10">
          <div id="resume-content" className="bg-white shadow-2xl rounded-lg">
            <ResumePreview resumeInfo={resumeInfo} />
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
