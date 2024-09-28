"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Use lowercase 'link' in Next.js
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie to access token
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const router = useRouter(); // Initialize router for navigation
  const [userToken, setUserToken] = useState<string | null>(null); // State for user token

  // On component mount, check for token in cookies
  useEffect(() => {
    const token: string | undefined = Cookies.get("token"); // Get token from cookies
    setUserToken(token || null);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token from cookies
    setUserToken(null); // Update state
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo Section */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="/images/logo.png"
          alt="Event Logo"
          className="h-12 w-12 mr-3"
        />
        <h1 className="text-2xl font-bold">PlanIT</h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <Button
          variant="ghost"
          className="text-black"
          onClick={() => router.push("/")}
        >
          Home
        </Button>
        <Button
          variant="ghost"
          className="text-black"
          onClick={() => router.push("/about")}
        >
          About Us
        </Button>
        <Button
          variant="ghost"
          className="text-black"
          onClick={() => router.push("/contact")}
        >
          Contact
        </Button>
      </nav>

      {/* Profile, Login/Signup or Dashboard Buttons */}
      <div className="flex items-center space-x-4">
        {userToken ? (
          <>
            {/* Show "Dashboard" and "Logout" when the user is logged in */}
            <Button onClick={() => router.push("/dashboard")} className="bg-[#2b5e9f]">
              Dashboard
            </Button>
            <Button onClick={handleLogout} className="bg-red-600 text-white">
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Show "Login" and "Sign Up" when the user is not logged in */}
            <Link href="/auth/login">
              <Button className="bg-[#2b5e9f]">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
