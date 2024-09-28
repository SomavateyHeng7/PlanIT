import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Button } from '@/components/ui/button'; // Assuming Button is from shadcn

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8 text-center sm:text-left">
          
          {/* About Section */}
          <div className="sm:w-1/3">
            <h2 className="text-lg font-semibold mb-4">About PlanIT</h2>
            <p className="text-gray-400">
              PlanIT helps you discover events, manage ticketing, and organize your own events seamlessly.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="sm:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Explore</h2>
            <ul className="space-y-2">
              <li>
                <Button variant="link" asChild>
                  <a href="/find-events" className="text-gray-200 hover:text-[#ffa599] transition">
                    Find Events
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild>
                  <a href="/create-events" className="text-gray-200 hover:text-[#ffa599] transition">
                    Create Events
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild>
                  <a href="/help-center" className="text-gray-200 hover:text-[#ffa599] transition">
                    Help Center
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild>
                  <a href="/tickets" className="text-gray-200 hover:text-[#ffa599] transition">
                    Find My Tickets
                  </a>
                </Button>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="sm:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Connect with Us</h2>
            <ul className="flex justify-center sm:justify-start space-x-6">
              <li>
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#ffa599] transition">
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-[#ffa599] transition">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-[#ffa599] transition">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-[#ffa599] transition">
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PlanIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
