import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { Brain, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [summery, setSummery] = useState(resumeInfo?.summery || "");
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      summery: summery,
    }));
  }, [summery]);

  // 🔥 FAKE AI (no error version)
  const GenerateSummeryFromAI = () => {
    setLoading(true);

    setTimeout(() => {
      const dummy = [
        {
          experience_level: "Fresher",
          summary:
            "Motivated and detail-oriented fresher with strong foundational skills and a passion for learning new technologies.",
        },
        {
          experience_level: "Mid Level",
          summary:
            "Experienced professional with solid technical skills and ability to deliver scalable solutions in fast-paced environments.",
        },
        {
          experience_level: "Senior",
          summary:
            "Highly skilled expert with leadership experience, capable of designing complex systems and mentoring teams.",
        },
      ];

      setAiGenerateSummeryList(dummy);
      setLoading(false);
    }, 1000);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Summary Saved:", summery);

    setTimeout(() => {
      enabledNext(true);
      setLoading(false);
      toast("Details updated");
    }, 800);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>

            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summery}
            onChange={(e) => setSummery(e.target.value)}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>

          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item.summary)}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item.experience_level}
              </h2>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;
