import React, { useEffect, useState } from "react";
import PersonalDetail from "./forms/PersonalDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import Summery from "./forms/Summery";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Skills from "./forms/Skills";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const { resumeId } = useParams();
  const navigate = useNavigate();

  // 🔥 reset next on form change
  useEffect(() => {
    setEnableNext(false);
  }, [activeFormIndex]);

  const handleNext = () => {
    if (activeFormIndex >= 5) {
      navigate(`/my-resume/${resumeId}/view`);
    } else {
      setActiveFormIndex((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-5">
          <Link to="/dashboard">
            <Button>
              <Home />
            </Button>
          </Link>
          <ThemeColor />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              onClick={() =>
                setActiveFormIndex((prev) => Math.max(prev - 1, 1))
              }
            >
              <ArrowLeft />
            </Button>
          )}

          <Button
            disabled={!enableNext}
            className="flex gap-2"
            size="sm"
            onClick={handleNext}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 2 ? (
        <Summery enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 3 ? (
        <Experience enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 4 ? (
        <Education enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 5 ? (
        <Skills enabledNext={(v) => setEnableNext(v)} />
      ) : null}
    </div>
  );
}

export default FormSection;
