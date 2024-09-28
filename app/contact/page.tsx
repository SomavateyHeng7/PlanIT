"use client";

import { useState } from "react";
import Navbar from "@/components/shared/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your form handling logic here (e.g., sending an API request)
    console.log("Form submitted with:", { name, email, message });
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-16 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          We’d love to hear from you! Whether you have a question about our services, pricing, or anything else, our
          team is ready to answer all your questions.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-lg font-semibold text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-500">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
