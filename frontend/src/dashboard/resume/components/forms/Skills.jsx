import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "sonner";
import GlobalApi from "@/service/GlobalApi";
import { useNavigate } from "react-router-dom";

function Skills({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const navigate = useNavigate();

  const [skillsList, setSkillsList] = useState([{ name: "", rating: 0 }]);
  const [loading, setLoading] = useState(false);

  // 🔥 FIX: remove invalid "undefined" id from localStorage
  useEffect(() => {
    const id = localStorage.getItem("resumeId");
    if (id === "undefined") {
      localStorage.removeItem("resumeId");
    }
  }, []);

  // 🔥 LOAD EXISTING SKILLS
  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  const handleChange = (index, field, value) => {
    const newEntries = [...skillsList];

    if (field === "rating") {
      value = Math.min(5, Math.max(1, Number(value)));
    }

    newEntries[index][field] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { name: "", rating: 0 }]);
  };

  const RemoveSkills = () => {
    setSkillsList((prev) => prev.slice(0, -1));
  };

  // 🔥 SYNC WITH GLOBAL STATE
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList,
    }));
  }, [skillsList, setResumeInfo]);

  // 🔥 FINAL SAVE (CREATE + UPDATE FIXED)
  const onSave = async () => {
    setLoading(true);

    const updatedData = {
      ...resumeInfo,
      skills: skillsList,
    };

    console.log("FINAL DATA:", updatedData);

    try {
      let id = localStorage.getItem("resumeId");

      // ========================
      // 🔥 UPDATE CASE
      // ========================
      if (id && id !== "undefined") {
        await GlobalApi.UpdateResume(id, updatedData);

        toast.success("Resume updated successfully ✅");

        enabledNext(true);

        navigate(`/my-resume/${id}/view`);
      }

      // ========================
      // 🔥 CREATE CASE
      // ========================
      else {
        const res = await GlobalApi.SaveResume(updatedData);

        console.log("API RESPONSE:", res.data);

        // 🔥 SAFE ID EXTRACTION
        const newId = res.data?.id || res.data?._id;

        if (!newId) {
          toast.error("Resume ID not received ❌");
          setLoading(false);
          return;
        }

        // 🔥 SAVE ID
        localStorage.setItem("resumeId", newId);
        console.log("Saved ID:", newId);

        toast.success("Resume created successfully ✅");

        enabledNext(true);

        navigate(`/my-resume/${newId}/view`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Save failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 dark:bg-gray-900 dark:text-white">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-3 border rounded-lg p-3 gap-3 dark:border-gray-700"
          >
            <div className="flex-1">
              <label className="text-xs">Skill Name</label>
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs">Rating (1–5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={item.rating}
                onChange={(e) => handleChange(index, "rating", e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkills}>
            + Add More
          </Button>
          <Button variant="outline" onClick={RemoveSkills}>
            - Remove
          </Button>
        </div>

        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
