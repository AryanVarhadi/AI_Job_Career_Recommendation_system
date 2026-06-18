import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { isSignedIn } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // 🔥 TOGGLE
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <div className="p-3 px-5 flex justify-between shadow-md dark:bg-gray-900 dark:text-white transition-all">
      {/* LOGO */}
      <img src="/logo.svg" className="h-7 w-auto" />

      {isSignedIn ? (
        <div className="flex gap-3 items-center">
          <Link to={"/dashboard"}>
            <Button variant="outline">Dashboard</Button>
          </Link>

          {/* 🌞 DARK MODE BUTTON */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-md border 
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="/sun.svg" // ✅ public folder se direct use
              alt="theme"
              className={`w-5 h-5 transition-transform duration-500 ${
                darkMode ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/sign-in"}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
