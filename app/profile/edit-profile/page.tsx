'use client';
import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // To access the token
import { ArrowLeftIcon } from 'lucide-react';

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '', // This is only displayed and not editable
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    // Fetch the current user's profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || 'Failed to load profile');
          return;
        }

        setUser({ name: result.profile.name, email: result.profile.email });
      } catch (err) {
        setError('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccessMessage('');

    const token = Cookies.get('token');
    if (!token) {
      setError('Unauthorized');
      return;
    }

    try {
      const response = await fetch('/api/updatename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token in the request
        },
        body: JSON.stringify({
          newName: user.name, // Only update the name
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to update profile');
        return;
      }

      setSuccessMessage('Profile updated successfully');

      // Navigate to the profile page
      router.push('/profile');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="flex flex-col items-center">
            <button
              onClick={handleBack}
              className="self-start mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mb-2 p-2 border rounded w-full"
              placeholder="Name"
            />
            <button
              onClick={handleSaveProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Profile
            </button>

            {/* Display error or success messages */}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;