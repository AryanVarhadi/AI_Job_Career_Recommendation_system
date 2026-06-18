import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "sonner";

function ThemeColor() {
  const colors = [
    "#000000", // 🖤 Black
    "#ffffff", // 🤍 White
    "#1f2937",
    "#374151",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFA1",
    "#FF7133",
    "#71FF33",
    "#7133FF",
    "#FF3371",
    "#33FF71",
    "#3371FF",
    "#A1FF33",
    "#33A1FF",
    "#5733FF",
    "#33FF5A",
    "#5A33FF",
    "#FF335A",
    "#335AFF",
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState(
    resumeInfo?.themeColor || "#000000",
  );

  const onColorSelect = (color) => {
    setSelectedColor(color);

    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });

    toast("Theme Color Updated");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>

        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-6 w-6 rounded-full cursor-pointer border
                hover:scale-110 transition-all
                ${
                  selectedColor === item
                    ? "border-2 border-black"
                    : "border-gray-300"
                }
              `}
              style={{
                background: item,
                // 👇 white visible fix
                boxShadow: item === "#ffffff" ? "0 0 0 1px #ccc inset" : "none",
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
