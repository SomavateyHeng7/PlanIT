'use client';
import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies

    if (!token) {
      router.push('/signin'); // Redirect to login page if no token found
      return;
    }

    // Fetch user profile from API
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to load profile');
          return;
        }

        setUser(result.profile); // Set user profile data
      } catch (err) {
        setError('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleEditProfile = () => {
    router.push('/profile/edit-profile');
  };

  const handleBack = () => {
    router.push('/dashboard/events');
  };

  if (!user) {
    return <div className="text-center">Loading...</div>; // Show loading while fetching data
  }

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative">
          <div className="absolute top-4 left-4">
            <button onClick={handleBack} aria-label="Back">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={handleEditProfile} aria-label="Edit Profile">
              <PencilIcon className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <p className="text-gray-800 text-center">{user.bio || 'No bio available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
