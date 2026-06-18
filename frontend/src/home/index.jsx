import { AtomIcon, Edit, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="z-50">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
            Build Your Resume <span className="text-primary">With AI</span>
          </h1>

          <p className="mb-8 text-lg text-gray-500">
            Effortlessly Craft a Standout Resume with Our AI-Powered Builder
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-5 py-3 text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 px-4 text-center">
        <h2 className="font-bold text-3xl">How it Works?</h2>
        <p className="text-gray-500">Create your resume in 3 simple steps</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 border rounded-xl shadow hover:shadow-md transition">
            <AtomIcon className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold">Fill Details</h2>
            <p className="text-gray-600 text-sm">
              Enter your personal, education and experience details.
            </p>
          </div>

          <div className="p-8 border rounded-xl shadow hover:shadow-md transition">
            <Edit className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold">Edit Resume</h2>
            <p className="text-gray-600 text-sm">
              Customize and improve your resume using AI.
            </p>
          </div>

          <div className="p-8 border rounded-xl shadow hover:shadow-md transition">
            <Share2 className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold">Download & Share</h2>
            <p className="text-gray-600 text-sm">
              Download your resume and apply for jobs easily.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/auth/sign-in"
            className="px-8 py-3 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
