import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

function Experience({ enabledNext }) {
  // ✅ FIX 1

  const [experienceList, setExperienceList] = useState([
    {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      workSummery: "",
    },
  ]);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  // Load existing data
  useEffect(() => {
    if (resumeInfo?.Experience?.length > 0) {
      setExperienceList(resumeInfo.Experience);
    }
  }, []);

  const handleChange = (index, event) => {
    const newEntries = [...experienceList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummery: "",
      },
    ]);
  };

  const RemoveExperience = () => {
    setExperienceList((prev) => prev.slice(0, -1));
  };

  // Update context
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      Experience: experienceList,
    }));
  }, [experienceList]);

  // ✅ FIX 2 (MAIN LOGIC)
  const onSave = () => {
    setLoading(true);

    setTimeout(() => {
      // 🔥 SAVE DATA
      localStorage.setItem(
        "resumeData",
        JSON.stringify({
          ...resumeInfo,
          Experience: experienceList,
        }),
      );

      setLoading(false);

      // 🔥 TOAST
      toast.success("Experience saved successfully ✅");

      // 🔥 ENABLE NEXT
      enabledNext(true);
    }, 500);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add your previous job experience</p>

        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    name="title"
                    value={item.title}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    name="companyName"
                    value={item.companyName}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="text-xs">City</label>
                  <Input
                    name="city"
                    value={item.city}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="text-xs">State</label>
                  <Input
                    name="state"
                    value={item.state}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={item.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={item.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs">Work Summary</label>
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    value={item.workSummery}
                    onChange={(e) =>
                      handleChange(index, {
                        target: { name: "workSummery", value: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewExperience}
              className="text-primary"
            >
              + Add More
            </Button>

            <Button
              variant="outline"
              onClick={RemoveExperience}
              className="text-primary"
            >
              - Remove
            </Button>
          </div>

          <Button disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
