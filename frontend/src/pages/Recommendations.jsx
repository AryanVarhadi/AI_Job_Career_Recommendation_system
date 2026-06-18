import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "@/service/GlobalApi";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

function Recommendations() {
  const { resumeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  // =========================
  // 📄 FORMAT FUNCTION (🔥 NEW)
  // =========================
  const formatText = (text) => {
    if (!text) return "";

    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        "<h3 class='font-semibold text-base mt-4 mb-2'>$1</h3>",
      )
      .replace(/\n/g, "<br/>")
      .replace(/\*/g, "•");
  };

  // =========================
  // 📄 FILE UPLOAD + AUTO ANALYZE
  // =========================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://127.0.0.1:8000/upload-analyze",
        formData,
      );

      setAnalysis(res.data.analysis);
      setResumeText(res.data.resume_text);
    } catch (err) {
      console.log(err);
      alert("Upload/Analysis failed ❌");
    }

    setLoading(false);
  };

  // =========================
  // 💼 GET JOBS
  // =========================
  const handleJobs = async () => {
    setLoading(true);

    try {
      const res = await GlobalApi.GetJobs({
        resume_text: resumeText,
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
      alert("Jobs fetch failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">
      <h2 className="text-3xl font-bold text-center">
        Get Your Desired Job According To Your Resume
      </h2>

      {/* ========================= */}
      {/* 📄 UPLOAD */}
      {/* ========================= */}
      {!analysis && (
        <div className="text-center border p-10 rounded-xl shadow-md bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-4">
            Upload Your Resume to Analyze
          </h3>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="mb-4"
          />

          {fileName && (
            <p className="text-sm text-gray-500">Selected: {fileName}</p>
          )}
        </div>
      )}

      {/* ========================= */}
      {/* 🔄 LOADING */}
      {/* ========================= */}
      {loading && (
        <div className="text-center mt-6">
          <LoaderCircle className="animate-spin mx-auto" />
          <p className="mt-2">Analyzing Resume...</p>
        </div>
      )}

      {/* ========================= */}
      {/* 🤖 ANALYSIS */}
      {/* ========================= */}
      {analysis && (
        <>
          <div className="p-6 rounded-xl shadow-lg border bg-white dark:bg-gray-900 transition-all">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              📄 AI Analysis
            </h3>

            <div
              className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: formatText(analysis),
              }}
            />
          </div>

          {/* BUTTON */}
          <div className="text-center">
            <Button className="mt-2" onClick={handleJobs}>
              Get Job Recommendations
            </Button>
          </div>
        </>
      )}

      {/* ========================= */}
      {/* 💼 JOBS */}
      {/* ========================= */}
      {jobs.length > 0 && (
        <div>
          <h3 className="font-bold mb-4 text-xl">💼 Recommended Jobs</h3>

          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="p-5 border rounded-xl shadow-md hover:shadow-xl transition bg-white dark:bg-gray-900"
              >
                <h3 className="font-semibold text-lg">{job.title}</h3>

                <p className="text-gray-600 dark:text-gray-300">
                  {job.company}
                </p>

                <p className="text-sm text-gray-500 mb-3">📍 {job.location}</p>

                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">Apply Now</Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
