import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p className="text-gray-600 mt-4">Welcome, {currentUser?.displayName}!</p>
    </div>
  );
};

export default Profile;
