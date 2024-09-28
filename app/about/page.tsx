"use client";

import Navbar from "@/components/shared/NavBar";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-16 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-900">About Us</h1>

        <p className="mt-6 text-lg text-gray-700">
          Welcome to PlanIT, your trusted partner in event management. Our mission is to make event planning
          simple, accessible, and enjoyable for everyone. Whether you're planning a small gathering or a large
          corporate event, we're here to provide you with the tools and support you need to make your event a success.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          At PlanIT, we believe that events bring people together and create memorable experiences. Our team of
          dedicated professionals is passionate about helping you create events that matter, from conferences and
          trade shows to workshops and parties. We provide seamless event management solutions with the latest technology to 
          make every step of your journey smoother.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          We strive to innovate and push the boundaries of what's possible in event management. Our platform is designed
          to be user-friendly, adaptable, and robust, ensuring that your event runs smoothly no matter its size or complexity.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          Join us in making every event an extraordinary one. With PlanIT, the future of event management is here.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
