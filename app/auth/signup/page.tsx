'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Cookies from 'js-cookie'; // Import js-cookie
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Check for token in cookies on mount
    const token = Cookies.get('token');
    if (token) {
      router.push('/'); // Redirect to home page if token exists
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create a JSON payload to send the form data
      const payload = {
        name,
        email,
        password,
        confirmPassword,
      };

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to register");
        return;
      }

      // Handle success
      setSuccessMessage("Registration successful! Please log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Store token in cookies
      Cookies.set('token', result.token, { expires: 7 });

      // Navigate to the home page
      router.push('/');
    } catch (err) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded shadow-md">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative">
          {/* Replace with your logo path */}
          <img
            src="/images/logo.png" // Adjust the path if needed
            alt="Register"
            className="object-cover w-full h-full rounded-l"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 space-y-8">
          <h1 className="text-2xl font-bold text-center text-[#2b5e9f]">
            Register
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Error or Success Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#2b5e9f] text-white hover:bg-blue-700"
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;