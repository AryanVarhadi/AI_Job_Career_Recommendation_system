import { Loader2Icon, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import GlobalApi from "@/service/GlobalApi"; // 🔥 ADD

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 REAL DELETE
  const onDelete = async () => {
    setLoading(true);

    try {
      await GlobalApi.DeleteResume(resume?._id);

      toast.success("Resume Deleted ✅");

      refreshData && refreshData();
      setOpenAlert(false);
    } catch (error) {
      console.log(error);
      toast.error("Delete failed ❌");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* 🔥 EDIT PAGE */}
      <Link to={`/dashboard/resume/${resume?._id}/edit`}>
        <div
          className="p-14 bg-gradient-to-b
          from-pink-100 via-purple-200 to-blue-200
          h-[280px] rounded-t-lg border-t-4"
          style={{
            borderColor: resume?.themeColor || "#6366f1",
          }}
        >
          <div className="flex items-center justify-center h-[180px]">
            <img src="/cv.png" width={80} height={80} />
          </div>
        </div>
      </Link>

      {/* 🔥 CARD BOTTOM */}
      <div
        className="border p-3 flex justify-between text-white rounded-b-lg shadow-lg"
        style={{
          background: resume?.themeColor || "#6366f1",
        }}
      >
        {/* 🔥 NAME */}
        <h2 className="text-sm">
          {resume?.firstName} {resume?.lastName}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {/* EDIT */}
            <DropdownMenuItem
              onClick={() =>
                navigation(`/dashboard/resume/${resume?._id}/edit`)
              }
            >
              Edit
            </DropdownMenuItem>

            {/* VIEW */}
            <DropdownMenuItem
              onClick={() => navigation(`/my-resume/${resume?._id}/view`)}
            >
              View
            </DropdownMenuItem>

            {/* DOWNLOAD */}
            <DropdownMenuItem
              onClick={() => navigation(`/my-resume/${resume?._id}/view`)}
            >
              Download
            </DropdownMenuItem>

            {/* DELETE */}
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ALERT */}
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your resume.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;
