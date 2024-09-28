import { Input } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Cookies from 'js-cookie';

interface ReviewProps {
  eventId: string;
}

interface Review {
  _id: string;
  text: string;
}

const Review: React.FC<ReviewProps> = ({ eventId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [error, setError] = useState('');

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review/reviews/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews); // Ensure the response format matches
      } catch (err) {
        // setError('Error fetching reviews');
      }
    };

    fetchReviews();
  }, [eventId]);

  // Add a new review
  const handleAddReview = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('You must be logged in to add a review');
      return;
    }

    try {
      const response = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, text: newReview }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create review');
        return;
      }

      setReviews([...reviews, result.review]); // Add the new review to the list
      setNewReview(''); // Clear the input field
    } catch (error) {
      setError('Failed to add review');
    }
  };

  // Delete a review
  const handleDeleteReview = async (id: string) => {
    const token = Cookies.get('token');
    if (!token) {
      setError('You must be logged in to delete a review');
      return;
    }

    try {
      const response = await fetch(`/api/review/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Failed to delete review');
        return;
      }

      setReviews(reviews.filter((review) => review._id !== id)); // Remove the deleted review
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  // Update a review
  const handleUpdateReview = async (id: string) => {
    const token = Cookies.get('token');
    if (!token) {
      setError('You must be logged in to edit a review');
      return;
    }

    try {
      const response = await fetch(`/api/review/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editingReview?.text || '' }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Failed to update review');
        return;
      }

      if (editingReview) {
        setReviews(reviews.map((review) => (review._id === id ? editingReview : review)));
      }
      setEditingReview(null); // Exit edit mode
    } catch (error) {
      setError('Failed to update review');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4 flex items-center">
        <Input
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Add a new review"
          className="w-full mb-2"
        />
        <FaPlus onClick={handleAddReview} className="text-blue-600 cursor-pointer ml-2" size={24} />
      </div>
      {reviews.length === 0 ? (
        <p>There are no reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} className="mb-4 p-4 bg-white shadow rounded flex justify-between items-center">
              {editingReview && editingReview._id === review._id ? (
                <div className="flex-1">
                  <Input
                    value={editingReview.text}
                    onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                    placeholder="Edit review"
                    className="w-full mb-2"
                  />
                  <div className="flex space-x-2">
                    <FaEdit onClick={() => handleUpdateReview(review._id)} className="text-green-600 cursor-pointer" size={24} />
                    <FaTrash onClick={() => setEditingReview(null)} className="text-gray-600 cursor-pointer" size={24} />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-lg">{review.text}</p>
                  <div className="flex space-x-2 mt-2">
                    <FaEdit onClick={() => setEditingReview(review)} className="text-yellow-600 cursor-pointer" size={24} />
                    <FaTrash onClick={() => handleDeleteReview(review._id)} className="text-red-600 cursor-pointer" size={24} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Review;